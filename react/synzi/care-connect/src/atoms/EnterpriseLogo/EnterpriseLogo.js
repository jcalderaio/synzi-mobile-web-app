import React, { Component } from 'react'
import {
    View,
    Image
} from 'react-native';
import styles from './styles';
import AuthUtils from '../../../../_shared/helpers/AuthUtils';
import { CachedImage } from "react-native-img-cache"
import EnterpriseQL from '../../graphql/EnterpriseQL'

// GraphQL
import { Query } from 'react-apollo'

import Reactotron from 'reactotron-react-native'

import SynziLogoPlaceholder from '../../../../_shared/images/logos/logo_placeholder.png'


export default class EnterpriseLogo extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      logoImage: null,
      entId: null,
      hasLogo: false,
    }

    this.handleSuccess = this.handleSuccess.bind(this)
  }
  //prop 'entId' needed on confirm birthdate screen in order to update to match user links

  async componentWillMount() {
    //Reactotron.log("EnterpriseLogo componentWillMount()")
    const logoImage = await AuthUtils.getEnterpriseLogo()
    const entId = await AuthUtils.getEnterpriseIdFromInviteToken()
    const hasLogo = logoImage ? true : false
    this.setState({ logoImage, entId })
  }

  async componentWillUpdate(nextProps) {
    //Reactotron.log("EnterpriseLogo componentWillUpdate() :: nextProps:", nextProps, " :: current entId=", this.props.entId)
    if (nextProps.entId && nextProps.entId !== this.props.entId) {
      const entId = await AuthUtils.getEnterpriseIdFromInviteToken()
      this.setState( { logoImage: null, entId: entId, hasLogo: false } )
    }
  }

  async handleSuccess(data) {
    //Reactotron.log("EnterpriseLogo handleSuccess() :: data", data)
    let logoImage = ''
    let hasLogo = false
    if (data && data.enterpriseInfo) {
      hasLogo = true
      if (data.enterpriseInfo.image) logoImage = data.enterpriseInfo.image
    }
    await AuthUtils.setEnterpriseLogo(logoImage)
    this.setState({ logoImage: logoImage, hasLogo })
  }

  renderDefaultLogo() {
    //Reactotron.log("EnterpriseLogo renderDefaultLogo")
    return (
        <View style={styles.logoContainerStyle} >
          <Image
            style={
              {
                width: 200, 
                height: 50
              }
            }
            resizeMode={'contain'}
            source={SynziLogoPlaceholder}
          />
        </View>
      )
  }

  renderLogo(logoImage) {
    if (logoImage === null || logoImage === '') {
      return this.renderDefaultLogo()
    }
    else {
      //Reactotron.log("EnterpriseLogo renderLogo :: logoImage:", logoImage)
      return (
        <View style={styles.logoContainerStyle} >
          <CachedImage 
            style={
              {
                  width: 200, 
                  height: 50
              }
            }
            resizeMode={'contain'}
            source={{ uri: logoImage }} 
          />
        </View>
      )
    }
  }
  
  render() {

    let { logoImage, entId, hasLogo } = this.state
 
    //Reactotron.log("EnterpriseLogo :: logoImage = ", logoImage)
    //Reactotron.log("EnterpriseLogo :: entId = ", entId)
    //Reactotron.log("EnterpriseLogo :: hasLogo = ", hasLogo)

    if (logoImage) {
      //Reactotron.log("EnterpriseLogo :: SHOW LOADED LOGO")
      return this.renderLogo(logoImage)
    } else if (entId && !hasLogo) {
      //Reactotron.log("EnterpriseLogo :: LOADING IMAGE FOR ENTERPRISE ", entId)
      return(
        <Query 
          query={EnterpriseQL.getInfo()}
          variables={{ id: entId }}
        >
          {({ loading, error, data }) => {
            if (error) {
              Reactotron.error(
                'EnterpriseLogo query error: ',
                error.message
              )
              return this.renderDefaultLogo()
            }

            if (data && !loading) {
              //wait momentarily for state change
              setTimeout(()=>{
                this.handleSuccess(data)
              }, 100)
            }

            //loading or about to render
            return <View style={styles.logoContainerStyle} ></View>
          }}
        </Query>
      )
    } else {
      //Reactotron.log("EnterpriseLogo :: SHOW DEFAULT!")
      return this.renderDefaultLogo()
    }

  }
}