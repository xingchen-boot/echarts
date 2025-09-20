<template>
  <div class="com-container"  @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getProvinceMapInfo } from '@/utils/map_utils'
import axios from 'axios'
export default {
  name: 'Map',
  data () {
    return {
      chartInstance: null,
      allData: null,
      titleFontSize: 0,
      mapData: {},
      bigChina: true
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
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 组件销毁时，取消回调函数的注册
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, this.theme)
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▎商家分布'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async arg => {
        if (!this.bigChina) return
        this.bigChina = false
        const provinceInfo = getProvinceMapInfo(arg.name)
        console.log(provinceInfo)
        if (provinceInfo.key === undefined) return
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData (ret) {
      this.allData = ret
      console.log(this.allData)
      this.updateChart()
    },
    updateChart () {
      const seriesArr = this.allData.map(item => {
        return {
          name: item.name,
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          coordinateSystem: 'geo',
          data: item.children
        }
      })
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr,
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      this.bigChina = true
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style></style>
