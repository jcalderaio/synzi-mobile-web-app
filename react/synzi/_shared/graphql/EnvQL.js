import gql from 'graphql-tag'

class EnvQl {
    
    getEnvironments() {
        return gql`{ 
            envs { 
                name,
                code, 
                graphqlUrl, 
                restUrl, 
                socketUrl, 
                videoUrl, 
                assetsUrl, 
                isActive,
                vcMinVersion,
                ccMinVersion
                } 
            }
        `
    }

    currentEnv() {
        return gql`{ 
            currentEnv { 
                name,
                code, 
                graphqlUrl, 
                restUrl, 
                socketUrl, 
                videoUrl, 
                assetsUrl,
                vcMinVersion,
                ccMinVersion
                } 
            }
        `
    }
}


export default new EnvQl()