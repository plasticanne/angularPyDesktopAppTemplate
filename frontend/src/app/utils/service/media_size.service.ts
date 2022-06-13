import { Injectable, } from '@angular/core';



@Injectable()
export class Media_sizeService {
	mediaWidth
	mediaHeight
	setMaxWidth = 100000
	setCritWidth = 768
	smScrollwidth = 17
	smSurplusWidthLeft = 0
	smSurplusWidthRight = 0

	_videoWidth(getWidth, surplusWidthLeft, surplusWidthRight, scrollwidth) {

		if (getWidth <= this.setCritWidth) {
			scrollwidth = this.smScrollwidth;
			surplusWidthLeft = this.smSurplusWidthLeft;
			surplusWidthRight = this.smSurplusWidthRight
		}
		let correctWidth = getWidth - scrollwidth - surplusWidthLeft - surplusWidthRight
		if (correctWidth >= this.setMaxWidth) {
			return this.setMaxWidth
		} else {
			return correctWidth
		}
	}
	setting(
		setting : {
			setMaxWidth?: number,
			setCritWidth?: number,
			smScrollwidth?: number,
			smSurplusWidthLeft?: number,
			smSurplusWidthRight?: number
		}
	) {
		setting.setMaxWidth==undefined?this.setMaxWidth=100000:this.setMaxWidth = setting.setMaxWidth
		setting.setCritWidth==undefined?this.setCritWidth =768:this.setCritWidth = setting.setCritWidth
		setting.smScrollwidth==undefined?this.smScrollwidth=17:this.smScrollwidth = setting.smScrollwidth
		setting.smSurplusWidthLeft==undefined?this.smSurplusWidthLeft=0:this.smSurplusWidthLeft = setting.smSurplusWidthLeft
		setting.smSurplusWidthRight==undefined?this.smSurplusWidthRight =0:this.smSurplusWidthRight = setting.smSurplusWidthRight
	}
	setVideoWidth(innerWidth, rightWidth, leftWidth,scrollWidth=17) {
		this.mediaWidth = this._videoWidth(innerWidth, rightWidth, leftWidth, scrollWidth);
		this.mediaHeight = this.mediaWidth * 0.5625;
	}
}
