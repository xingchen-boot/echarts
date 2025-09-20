<template>
<div class="com-container" >
<div class="title" :style="comStyle">
  <span >{{'▎' + this.showTitle }}</span>
  <span class="iconfont title-icon" :style="comStyle" @click="showChoice=!showChoice">&#xe6eb;</span>
  <div class="select-con" v-show="showChoice" :style="marginStyle">
    <div class="select-item" v-for="item in selectType" :key="item.key" @click="handleSelect(item.key)">
      {{item.text}}
    </div>
  </div>
</div>
  <div class="com-chart" ref="trend_ref"></div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  name: 'Trend',
  data () {
    return {
      chartInstance: null,
      allData: null,
      showChoice: false,
      choiceType: 'map',
      titleFontSize: 0
    }
  },
  computed: {
    selectType () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getThemeValue(this.theme).titleColor
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
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
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, this.theme)
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true // grid 区域是否包含坐标轴的刻度标签
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
      console.log(this.allData)
    },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11,168,44,0)',
        'rgba(44,110,255,0)',
        'rgba(22,242,217,0)',
        'rgba(254,33,30,0)',
        'rgba(250,105,0,0)'
      ]
      const timeArr = this.allData.common.month
      const valueArr = this.allData[this.choiceType].data
      const legendArr = valueArr.map(item => item.name)
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[index] },
              { offset: 1, color: colorArr2[index] }
            ])
          }
        }
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adaptOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    },
    handleSelect (currentType) {
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  }
}
</script>

<style scoped>
.title{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;
  .title-icon{
    margin-left: 10px;
    cursor: pointer;
  }
}

.select-con{
  background-color: #222733;
}
</style>
