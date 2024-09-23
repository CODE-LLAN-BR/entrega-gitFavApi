export class GitUserData    {
    static search(userlogin)     {
        const endPoint = `https://api.github.com/users/${userlogin}` 

        return fetch(endPoint)
        .then(data => data.json() )
        .then(data => ({
            login: data.login ,
            name: data.name ,
            public_repos: data.public_repos,
            followers: data.followers
        }))
    }
}