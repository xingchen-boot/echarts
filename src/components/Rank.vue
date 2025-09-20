<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timer: null
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme: {
      handler () {
        console.log('主题切换了')
        if (this.chartInstance) {
          this.chartInstance.dispose()
        }
        this.initChart()
        this.screenAdapter()
        this.updateChart()
      }
    }
  },
  created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
    // 组件销毁时，取消回调函数的注册
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: {
          type: 'bar'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    getData (ret) {
      this.allData = ret
      this.allData.sort((a, b) => b.value - a.value)
      console.log(this.allData)
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      const provinceArr = this.allData.map(item => item.name)
      const valueArr = this.allData.map(item => item.value)
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        series: {
          data: valueArr,
          itemStyle: {
            color: arg => {
              let targetColorArr = null
              if (arg.value > 300) {
                targetColorArr = colorArr[0]
              } else if (arg.value > 200) {
                targetColorArr = colorArr[1]
              } else {
                targetColorArr = colorArr[2]
              }
              return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: targetColorArr[0] },
                { offset: 1, color: targetColorArr[1] }
              ])
            }
          }
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 1000)
    }
  }

}
</script>

<style>
</style>
