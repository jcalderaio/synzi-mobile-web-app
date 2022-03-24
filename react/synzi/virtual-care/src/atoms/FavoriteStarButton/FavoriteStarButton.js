import React, { Component } from 'react'
import {
    TouchableOpacity,
    Text,
    Image,
    View
} from 'react-native';
import styles from './styles';
import { Mutation } from 'react-apollo'
import UsersQl from '../../../../_shared/graphql/UsersQL'
import Reactotron from 'reactotron-react-native'


export default class FavoriteStarButton extends Component {


    renderUnFavoritedStar(){
        return(
            <Image
                style={styles.starSize}
                resizeMode={'contain'}
                source={require('../../../../_shared/images/icons/favoriteOff.png')}
            />
        )
    }


    renderFavoritedStar(){
        return(
            <Image
                style={styles.starSize}
                resizeMode={'contain'}
                source={require('../../../../_shared/images/icons/favoriteOn.png')}
            />
        )
    }

    render() {

        const { isFavorite, userId, currentUserId } = this.props

        let filledCurrent = isFavorite

        return (

            <Mutation mutation={UsersQl.updateUserFavorite()}>
                {(toggleFavorite, { loading, error, data }) => {

                // Reactotron.log(" :: userid = " + userid + " :: filled? " + filled)
                // Reactotron.log(' :: loading? ' + loading)
                // Reactotron.log(' :: error: ', error)
                // Reactotron.log(' :: data: ', data)
        
                // Leaving as a reminder in case we decide to implement later.
                // if (loading) return <Loader show={true} label="" />
        
                if (error) Reactotron.error('Failed to toggle Favorite', error)
        
                const handleFavorite = () => {
                    filledCurrent = !filledCurrent
        
                    const favs = filledCurrent
                    ? { append: [{ id: userId }] }
                    : { disconnect: [{ id: userId }] }
        
                    const variables = {
                        id: currentUserId,
                        favorites: favs,
                    }
        
                    toggleFavorite({
                        variables: variables,
                    })
                }
        
                return (
                    <View style={styles.containerStyle}>
                        <TouchableOpacity 
                            onPress={() => handleFavorite()}>
                            {filledCurrent ? this.renderFavoritedStar() : this.renderUnFavoritedStar()}
                        </TouchableOpacity>
                    </View>
                )
            }}
          </Mutation>
           
        )
    }
}