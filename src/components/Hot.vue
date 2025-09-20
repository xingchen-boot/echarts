<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref">
    </div>
    <span class="iconfont arr-left" @click="toLeft" :style="comStyle">&#xe6eb;</span>
    <span class="iconfont arr-right" @click="toRight" :style="comStyle">&#xe6ee;</span>
    <span class="cat-name">{{catName}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  computed: {
    catName () {
      if (!this.allData) return ''
      return this.allData[this.currentIndex].name
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
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
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 组件销毁时，取消回调函数的注册
    this.$socket.unRegisterCallBack('hotData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          formatter: arg => {
            const thirdCategory = arg.data.children
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            let resStr = ''
            thirdCategory.forEach(item => {
              resStr += `${item.name}:${parseInt(item.value / total * 100) + '%'} <br/>`
            })
            return resStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      const legendData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name
        }
      })
      const seriesData = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        series: [
          {
            data: seriesData
          }
        ],
        legend: {
          data: legendData
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex >= this.allData.length) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  }
}
</script>

<style>
.arr-left{
  position:absolute;
  color: #fff;
  left:20%;
  top: 58%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arr-right{
  position:absolute;
  color: #fff;
  right:20%;
  top: 58%;
  transform: translateY(-50%);
  cursor: pointer;
}
.cat-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>
