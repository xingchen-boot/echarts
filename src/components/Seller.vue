<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Seller',
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timer: null
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme: {
      handler () {
        console.log('主题切换了')
        this.chartInstance.dispose()
        this.initChart()
        this.screenAdapter()
        this.updateChart()
      }
    }
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    // 组件销毁时，取消回调函数的注册
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, this.theme)
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              fontSize: 26,
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#5052EE' },
                { offset: 1, color: '#AB6EE5' }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        if (this.timer) clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.StartInterval()
      })
    },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.allData.sort((a, b) => {
        return a.value - b.value
      })
      // 每五个元素为一页
      this.totalPage = Math.ceil(this.allData.length / 5)
      this.updateChart()
      this.StartInterval()
    },
    updateChart () {
      const showData = this.allData.slice((this.currentPage - 1) * 5, this.currentPage * 5)
      const dataOption = {

        yAxis: {
          data: showData.map(item => item.name)
        },

        series: [
          {

            data: showData.map(item => item.value)

          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    StartInterval () {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) this.currentPage = 1
        this.updateChart()
      }, 3000)
    },
    screenAdapter () {
      const titleFont = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: titleFont
          }
        },
        tooltip: {
          lineStyle: {
            width: titleFont,
            color: '#2D3443'
          }
        },
        series: [
          {
            barWidth: titleFont,
            itemStyle: {
              barBorderRadius: [0, titleFont / 2, titleFont / 2, 0]
            }
          }

        ]
      }
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>
