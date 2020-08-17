<template>
  <div class="app-container">
    <div id="chip-move-info" class="chip-move-info"/>
  </div>
</template>

<style lang="scss">
.chip-move-info .g6-component-toolbar {
  margin-left: 10px;
  li[code="redo"] {
    display: none;
  }
  li[code="undo"] {
    display: none;
  }
  li[code="realZoom"] {
    display: none;
  }
}
</style>

<script>
import G6 from '@antv/g6'
import request from '@/utils/request'
import dateFormat from '@/utils/dateformat'
export default {
  name: 'TrayChipMoveDetail',
  data() {
    return {
      graph: null,
      chip_list: null
    }
  },
  mounted() {
    this.initG6()
    this.refresh()
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.clear()
      this.graph.destroy()
    }
  },
  methods: {
    initG6() {
      const canvas_container = this.$el.querySelector('#chip-move-info')
      const toolbar = new G6.ToolBar()
      G6.registerNode('info', {
        /**
         * 绘制节点，包含文本
         */
        draw(cfg, group) {
          const keyShape = group.addShape('rect', {
            attrs: {
              x: cfg.x,
              y: cfg.y,
              width: cfg.size[0],
              height: cfg.size[1],
              lineWidth: 0
            },
            name: 'outer-shape'
          })
          // title
          group.addShape('rect', {
            attrs: {
              x: cfg.x,
              y: -40,
              width: cfg.size[0],
              height: 40,
              fill: '#EEEEEE'
            },
            name: 'title-shape'
          })
          group.addShape('text', {
            attrs: {
              text: ' Tray=' + cfg.toTrayId + ', X=' + cfg.toX + ', Y=' + cfg.toY,
              x: cfg.x,
              y: -28,
              fontSize: 16,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#0000D9'
            },
            name: 'text-shape'
          })
          group.addShape('text', {
            attrs: {
              text: ' 设备:' + cfg.eqpId + ', 时间:' + dateFormat(new Date(cfg.startTime)),
              x: cfg.x,
              y: -8,
              fontSize: 14,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#333333'
            },
            name: 'text-shape'
          })
          // cell size
          const space = Math.min(cfg.size[0] / cfg.trayRow, cfg.size[1] / cfg.trayCol)
          for (let i = 0; i < cfg.trayRow; i++) {
            for (let j = 0; j < cfg.trayCol; j++) {
              // 非所在cell颜色
              let color = '#BBBBBB'
              if (i === cfg.toX - 1 && j === cfg.toY - 1) {
                if (cfg.judgeResult === 'Y') {
                  color = '#009966'
                } else if (cfg.judgeResult === 'N') {
                  color = '#990000'
                } else {
                  color = '#003399'
                }
              }
              group.addShape('rect', {
                attrs: {
                  x: space * i,
                  y: space * j,
                  width: space - 1.5,
                  height: space - 1.5,
                  fill: color
                },
                name: 'cell-shape'
              })
            }
          }
          return keyShape
        },
        /**
         * 获取锚点（相关边的连入点）
         */
        getAnchorPoints(cfg) {
          return [
            [0, 0.5], // 左侧中间
            [1, 0.5] // 右侧中间
          ]
        }
      })
      this.graph = new G6.Graph({
        container: 'chip-move-info',
        fitView: true,
        fitCenter: true,
        width: canvas_container.scrollWidth,
        height: canvas_container.scrollHeight || 600,
        modes: {
          default: ['drag-canvas']
        },
        layout: {
          type: 'dagre',
          rankdir: 'LR',
          nodesep: 50,
          ranksep: 60
        },
        defaultNode: {
          type: 'info',
          size: [300, 300]
        },
        defaultEdge: {
          type: 'polyline',
          style: {
            offset: 30,
            endArrow: true,
            lineWidth: 3,
            stroke: '#C2C8D5'
          }
        },
        plugins: [toolbar]
      })
    },
    renderG6(chip_data) {
      this.graph.data(chip_data)
      this.graph.render()
    },
    refresh() {
      request({
        url: '/map/maptraychipmove/moveDetail',
        method: 'post',
        data: { chipId: this.$route.query.id }
      }).then((resp) => {
        if (resp.data.results) {
          this.chip_list = resp.data.results
        }
        // 所有的to构造成map
        const tomap = {}
        this.chip_list.forEach(function(itm) {
          // 时间转成数字，便于比较
          itm.startTime = Date.parse(itm.startTime)
          // g6的id必须为字符
          itm.id = '' + itm.id
          const key = '' + itm.toTrayId + '-' + itm.toX + '-' + itm.toY
          if (!tomap.hasOwnProperty(key)) {
            tomap[key] = []
          }
          tomap[key].push({
            id: itm.id,
            time: itm.startTime
          })
        })
        // 排序，按时间由大到小
        for (const toitm of Object.values(tomap)) {
          toitm.sort((a, b) => {
            return b.time - a.time
          })
        }
        // 构造边
        const edges = []
        this.chip_list.forEach(function(itm) {
          const fkey = itm.fromTrayId
            ? '' + itm.fromTrayId + '-' + itm.fromX + '-' + itm.fromY
            : '' + itm.toTrayId + '-' + itm.toX + '-' + itm.toY
          if (tomap.hasOwnProperty(fkey)) {
            const arr = tomap[fkey].filter((it) => {
              return itm.id !== it.id && itm.startTime > it.time
            })
            if (arr.length > 0) {
              edges.push({
                source: arr[0].id,
                target: itm.id
              })
            }
          }
        })
        this.renderG6({
          nodes: this.chip_list,
          edges
        })
      })
    }
  }
}
</script>
