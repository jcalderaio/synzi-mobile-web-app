import React, { Component } from 'react'
import { PixelRatio, Dimensions } from 'react-native'
import { isTablet } from 'react-native-device-detection'
// import deviceLog from 'react-native-device-log'

const WIDE_HEADER_MIN_WIDTH = 1500
const ALLOW_SIDEBAR_MIN_WIDTH = 1500

export const allowSidebar = calcAllowSidebar()
function calcAllowSidebar(){
    const pixelDensity = PixelRatio.get()
    const windowSize = Dimensions.get('window');
    const adjustedWidth = pixelDensity * windowSize.width
    const adjustedHeight = pixelDensity * windowSize.height

    const allow = (isTablet && adjustedWidth > ALLOW_SIDEBAR_MIN_WIDTH && adjustedHeight > ALLOW_SIDEBAR_MIN_WIDTH)
    // deviceLog.log("ALLOW SIDEBAR? " + allow)
    // deviceLog.log("adjust height = " + adjustedHeight)
    // deviceLog.log("adjusted width = " + adjustedWidth)
    // deviceLog.log("isTablet? " + isTablet)
    // console.log("*** ALLOW SIDEBAR? ", allow)
    
    return allow
}

export default class OrientationResponsiveComponent extends Component {

    constructor(props) {
        super(props)
        this.state = { orientation: this.currentOrientation() }
        this.isWide = this.isWide.bind(this)
        this.currentOrientation = this.currentOrientation.bind(this)
    }

    componentWillMount() {
        Dimensions.addEventListener('change', newDimensions => {
            this.setState({ orientation: this.currentOrientation(newDimensions) })
        })
    }
    componentWillUnmount() {
        Dimensions.removeEventListener('change', () => {});
    }

    currentOrientation(optionalNewDimensions) {
    	const windowSize = (optionalNewDimensions) ? optionalNewDimensions.window : Dimensions.get('window')

        // Retrieve new dimensions
        const screenWidth = windowSize.width;
        const screenHeight = windowSize.height;
        const orientation = (screenWidth < screenHeight) ? 'portrait' : 'landscape'

        // debug
        // const pixelDensity = PixelRatio.get()
        // const adjustedWidth = pixelDensity * windowSize.width
        // const adjustedHeight = pixelDensity * windowSize.height
        // console.log("*** Dimensions Change" 
        //     + " :: screen: " + screenWidth + " x " + screenHeight 
        //     + " :: adjusted: " + adjustedWidth + " x " + adjustedHeight
        //     + " :: orientation? " + orientation 
        //     + " :: isWide? " + this.isWide()
        // )
        
        return orientation
    }

    isWide() {
	    const pixelDensity = PixelRatio.get()
	    const windowSize = Dimensions.get('window');
	    const adjustedWidth = pixelDensity * windowSize.width
	    const isWideHeader = (adjustedWidth>WIDE_HEADER_MIN_WIDTH)

	    // console.log("***** :: Pixel Density: " + pixelDensity)
	    // console.log("***** :: Window Width: " + windowSize.width)
	    // console.log("***** :: Adjusted Width: " + adjustedWidth)
	    // console.log("*** OrientationResponsiveComponent isWide? " + isWideHeader)
	    return isWideHeader
    }

}