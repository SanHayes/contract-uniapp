<template>
	<view>
		<view class="maoScroll-main" :style="'height:'+(lineHeight*showLine)+'rpx;'">
			<view :style="'margin-top:-'+marginTop+'rpx;'">
				<view v-for="(item,index) in showdata" :key="'maoScroll'+index" :style="'height:'+lineHeight+'rpx;'">
					<slot :line="item" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'maoScroll',
		data() {
			return {
				showdata: [],
				marginTop: 0,
				showLine: 0,
				timer: null
			}
		},
		props: {
			data: {
        type: [Array, Object],
				default: []
			},
			showNum: {
				type: Number,
				default: 3,
			},
			lineHeight: {
				type: Number,
				default: 60,
			},
			animationScroll: {
				type: Number,
				default: 500,
			},
			animation: {
				type: Number,
				default: 2000,
			}
		},
		methods: {
			init: function() {
				this.showLine = this.showNum < this.data.length ? this.showNum : this.data.length;
				for (let i = 0; i < this.data.length; i++) {
					this.showdata.push(this.data[i]);
				}
				for (let i = 0; i < this.showLine; i++) {
					this.showdata.push(this.data[i]);
				}
				this.timer = setTimeout(this.animationFunc, this.animation);
			},
			animationFunc: function() {
				this.clearTimer()
				if (this.marginTop >= this.data.length * this.lineHeight) {
					this.marginTop = 0;
				}
				let stepTime = this.animationScroll / this.lineHeight;

				var step = 0;
				let self = this;
				self.marginTop = self.marginTop + 2;
				// var index = setInterval(function() {
				// 	self.marginTop = self.marginTop + 1;
				// 	step++;
				// 	if (step >= self.lineHeight) {
				// 		clearInterval(index);
				// 	}
				// }, stepTime);
				this.timer = setTimeout(this.animationFunc, this.animation)
			},
			clearTimer() {
				if (this.timer) {
					clearInterval(this.timer)
					this.timer = null
				}
			}
		},
		watch: {
			data(outdata, newdata) {
				this.clearTimer()
				this.init();
			},
      timer(newVal) {
        // @todo 这里不知道做什么一直在刷
        // console.log('scroll timer', newVal)
      },
		},
		beforeDestroy() {
			this.clearTimer()
			this.timer = null
		}
	}
</script>

<style>
	.maoScroll-main {
		width: 100%;
		overflow: hidden;
	}
</style>