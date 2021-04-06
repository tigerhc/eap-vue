<template>
  <div class="app-container">
    <div id="chip-move-info" class="chip-move-info" />
  </div>
</template>

<style lang="scss">
.chip-move-info .g6-component-toolbar {
  margin-left: 10px;
  li[code='redo'] {
    display: none;
  }
  li[code='undo'] {
    display: none;
  }
  li[code='realZoom'] {
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
              y: -48,
              fontSize: 26,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#0000D9'
            },
            name: 'text-shape'
          })
          group.addShape('text', {
            attrs: {
              text: '设备:' + cfg.eqpId + ',\n 时间:' + dateFormat(new Date(cfg.startTime)),
              x: cfg.x,
              y: -18, // 备注的汉字的显示位置向上移动
              fontSize: 19, // 备注的汉字的大小
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
        width: canvas_container.scrollWidth || 3600, // 整个背景的宽度
        height: canvas_container.scrollHeight || 1600, // 整个背景的高度
        modes: {
          default: ['drag-canvas']
        },
        layout: {
          type: 'dagre', // 层次布局
          rankdir: 'LR', // 从左至右布局
          nodesep: 50, // 节点间距（px）
          ranksep: 60 // 层间距（px）
        },
        defaultNode: {
          type: 'info',
          size: [200, 200]
        },
        defaultEdge: {
          type: 'polyline', // 折线
          style: {
            offset: 30, // 拐弯处距离节点最小距离
            endArrow: true, // 箭头
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
        // const tomap = {}
        // 所有的相同芯片
        // const eqsmap = {}
        this.chip_list.forEach(function(itm) {
          // 时间转成数字，便于比较
          itm.startTime = Date.parse(itm.startTime)
          // g6的id必须为字符
          itm.id = '' + itm.id
          // 识别标识
          // const key = '' + itm.toTrayId + '-' + itm.toX + '-' + itm.toY
          // itm.key = key
          // if (!tomap.hasOwnProperty(key)) {
          //  tomap[key] = []
          // }
          // tomap[key].push({
          //  id: itm.id,
          //  time: itm.startTime
          // })
          // if (itm.eqpType && (itm.eqpType & 12) > 0) {
          //  if (!eqsmap.hasOwnProperty(key)) {
          //    eqsmap[key] = []
          //  }
          //  eqsmap[key].push(itm.id)
          // }
        })
        // key为需要转换的ID,val为目标ID
        // const eqs = {}
        // for (const eqval of Object.values(eqsmap)) {
        //  if (eqval) {
        //    for (let i = 0; i < eqval.length; i++) {
        //      if (i !== 0) {
        //        eqs[eqval[i]] = eqval[0]
        //      }
        //    }
        //  }
        // }
        // 排序，按时间由大到小
        // for (const toitm of Object.values(tomap)) {
        //  toitm.sort((a, b) => {
        //    return b.time - a.time
        //  })
        // }
        // 构造节点
        //        const nodes = this.chip_list.filter((itm) => {
        //          if ((itm.eqpType & 12) > 0) {
        //            return !eqs.hasOwnProperty(itm.id)
        //          }
        //          return true
        //        })

        var nodes = []
        for (var i = 0; i < this.chip_list.length; i++) {
          if (i === 0) {
            nodes.push(this.chip_list[i])
          } else {
            var nodesRpt = true
            if (this.chip_list[i].eqpId === 'APJ-CHK') {
              if (this.chip_list[i].nextEqpId === 'APJ-HB2-SMT2' && this.chip_list[i].fromTrayId.indexOf('J0014') >= 0) {
                nodesRpt = false
                continue
              } else if (this.chip_list[i].nextEqpId === 'APJ-HB2-SMT1' && this.chip_list[i].fromTrayId.indexOf('J0015') >= 0) {
                nodesRpt = false
                continue
              }
            }
            for (var j = 0; j < nodes.length; j++) {
              // if (nodes[j].eqpId === this.chip_list[i].eqpId ) {
              if (nodes[j].eqpId === this.chip_list[i].eqpId && (nodes[j].eqpId === 'APJ-HB2-SMT1' || nodes[j].eqpId === 'APJ-HB2-SMT2')) {
                nodesRpt = false
                break
              }
            }
            if (nodesRpt) {
              nodes.push(this.chip_list[i])
            }
          }
        }

        // 构造边
        //        const edges = []
        //        this.chip_list.forEach(function(itm) {
        //          const fkey = itm.fromTrayId ? '' + itm.fromTrayId + '-' + itm.fromX + '-' + itm.fromY : itm.key
        //          if (tomap.hasOwnProperty(fkey)) {
        //            const arr = tomap[fkey].filter((it) => {
        //              return itm.id !== it.id && itm.startTime > it.time
        //            });
        //            if (arr.length > 0) {
        //              const src = arr[0].id
        //                edges.push({
        //                  source: eqs.hasOwnProperty(src) ? eqs[src] : src,
        //                  target: eqs.hasOwnProperty(itm.id) ? eqs[itm.id] : itm.id
        //                })
        //              }
        //            }
        //        })

        var edges = []
        for (var edgesI = 0; edgesI < nodes.length; edgesI++) {
          if (nodes[edgesI].nextEqpId) {
            for (var edgesJ = 0; edgesJ < nodes.length; edgesJ++) {
              // 设备的上下游关系正确
              if (nodes[edgesI].nextEqpId === nodes[edgesJ].eqpId) {
                if (nodes[edgesI].eqpId === 'APJ-VI1') {
                  if (nodes[edgesI].toTrayId.indexOf('J0015') > -1 && nodes[edgesJ].eqpId === 'APJ-HB2-SMT2') {
                    edges.push({
                      source: nodes[edgesI].id,
                      target: nodes[edgesJ].id
                    })
                  } else if (nodes[edgesI].toTrayId.indexOf('J0014') > -1 && nodes[edgesJ].eqpId === 'APJ-HB2-SMT1') {
                    edges.push({
                      source: nodes[edgesI].id,
                      target: nodes[edgesJ].id
                    })
                  }
                } else if (nodes[edgesI].nextEqpId === 'APJ-HB2-SMT1' || nodes[edgesI].nextEqpId === 'APJ-HB2-SMT2') { // 贴片机
                  edges.push({
                    source: nodes[edgesI].id,
                    target: nodes[edgesJ].id
                  })
                } else if (nodes[edgesI].nextEqpId === 'APJ-HB2-XRAY1') { // X射线与最后移载机连，原因是X射线的数据不提供from
                  edges.push({
                    source: nodes[edgesI].id,
                    target: nodes[edgesJ].id
                  })
                } else if ((nodes[edgesI].toTrayId === nodes[edgesJ].fromTrayId && nodes[edgesI].toX === nodes[edgesJ].fromX && nodes[edgesI].toY === nodes[edgesJ].fromY) ||
								(nodes[edgesI].toTrayId === nodes[edgesJ].toTrayId && nodes[edgesI].toX === nodes[edgesJ].toX && nodes[edgesI].toY === nodes[edgesJ].toY)) {
                  // 坐标正确
                  edges.push({
                    source: nodes[edgesI].id,
                    target: nodes[edgesJ].id
                  })
                }
              }
            }
          }
        }

        this.renderG6({
          nodes,
          edges
        })
      })
    }
  }
}
</script>
