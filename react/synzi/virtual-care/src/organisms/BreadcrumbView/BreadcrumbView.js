import React, { Component } from 'react'
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import BreadcrumbButton from '../../atoms/BreadcrumbButton/BreadcrumbButton'
import { CachedImage } from "react-native-img-cache";
import styles from './styles';

//Wide/Narrow Layout & Orientation Change Detection
import OrientationResponsiveComponent from '../../../../_shared/src/OrientationResponsiveComponent'


export default class BreadcrumbView extends OrientationResponsiveComponent {

    constructor(props) {
        super(props)
    }

    
    render() {

        const { logoImage, isCaregiver, navigateCreateCaregiver } = this.props

        const logoUrl = logoImage ? logoImage : ''

        if(isCaregiver) {
            if(this.isWide()){
                return(
                    <View style={styles.breadcrumbContainerStyle}>
                        <View style={styles.breadcrumbButtonContainerStyle}>
                            <BreadcrumbButton 
                                breadCrumbText={this.props.breadCrumbText}
                                onPress={this.props.goBack}
                            />
                        </View>
                        <View style={{ paddingRight: 135 }}>
                            {(logoUrl !== '') && 
                                <CachedImage 
                                    style = {{
                                        width: 200,
                                        height: 50,
                                    }}
                                    resizeMode={'contain'}
                                    source={{ uri: logoUrl }} 
                                />
                            }
                            {logoUrl === '' && 
                                <Image
                                    style = {{
                                        width: 200,
                                        height: 50,
                                    }}
                                    resizeMode={'contain'}
                                    source={require('../../../../_shared/images/logos/logo_placeholder.png')}
                                />
                            }
                        </View>
                        <TouchableOpacity
                            onPress={() => navigateCreateCaregiver()}
                        >
                            <Image
                                style={{ 
                                    width: 45, 
                                    height: 45,
                                    marginRight: 10
                                }}
                                resizeMode={'contain'}
                                source={require('../../../../_shared/images/icons/addPatientButton.png')} 
                            />
                        </TouchableOpacity>
                    </View>
                ) 
            }else{
                return(
                    <View style={styles.breadcrumbContainerStyle}>
                        <View style={styles.breadcrumbButtonContainerStyle}>
                            <BreadcrumbButton 
                                breadCrumbText={this.props.breadCrumbText}
                                onPress={this.props.goBack}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => navigateCreateCaregiver()}
                        >
                            <Image
                                style={{ 
                                    width: 42, 
                                    height: 42,
                                    marginRight: 12
                                }}
                                resizeMode={'contain'}
                                source={require('../../../../_shared/images/icons/addPatientButton.png')} 
                            />
                        </TouchableOpacity>
                    </View>
                ) 
            }
        }


        if(this.isWide()){
            return(
                <View style={styles.breadcrumbContainerStyle}>
                    <View style={styles.breadcrumbButtonContainerStyle}>
                        <BreadcrumbButton 
                            breadCrumbText={this.props.breadCrumbText}
                            onPress={this.props.goBack}
                        />
                    </View>
                    {(logoUrl !== '') && 
                        <CachedImage 
                            style = {{
                                width: 200,
                                height: 50,
                            }}
                            resizeMode={'contain'}
                            source={{ uri: logoUrl }} 
                        />
                    }
                    {logoUrl === '' && 
                        <Image
                            style = {{
                                width: 200,
                                height: 50,
                            }}
                            resizeMode={'contain'}
                            source={require('../../../../_shared/images/logos/logo_placeholder.png')}
                        />
                    }
                    <View style={styles.breadcrumbButtonContainerStyle}/>
                </View>
            ) 
        }else{
            return(
                <View style={styles.breadcrumbContainerStyle}>
                    <View style={styles.breadcrumbButtonContainerStyle}>
                        <BreadcrumbButton 
                            breadCrumbText={this.props.breadCrumbText}
                            onPress={this.props.goBack}
                        />
                    </View>
                    <View style={styles.breadcrumbButtonContainerStyle}/>
                </View>
            ) 
        }
    }
}