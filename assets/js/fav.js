import { GitUserData } from "./User.js"

//data structure
export class FavData    {
    constructor(root)   {
        this.root = document.querySelector(root)
        this.tbody = this.root.querySelector('table tbody')

        
        
        this.load()

    }

    load()  {
        this.entries = JSON.parse(localStorage.getItem('@github-fav:')) || []
    }

    save()  {
        localStorage.setItem('@github-fav:',JSON.stringify(this.entries))

    }
    
    async add(userlogin)   {
        try{
            const oneFavorite = this.entries.find(entry => entry.login === userlogin)
            if(oneFavorite){
                throw new Error('Esse usuário já está na lista de favoritos')
                
            }

            const user = await GitUserData.search(userlogin)


            if(user.login === undefined){
                throw new Error('O usuário não foi encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        }catch(error){
            alert(error.message)
        }

        
    }

    remove(user)    {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login)
            
            this.entries = filteredEntries
            this.update()
            this.save()
    }   
    
}

//events
export class FavAction extends FavData      {
    constructor(root)   {
        super(root)

        this.update()
        this.addFav()
        
        
    }

    addFav()   {  
        const button = this.root.querySelector('.search button')
        button.onclick = () => {
            const {value} = this.root.querySelector('.search input')

            this.add(value)
        }

    }

    update()    {
        
        this.trRemove()
        
        this.emptyRow()

        this.entries.forEach( user => {
            const row = this.Row()
            
            row.querySelector('.table-user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.table-user img').alt = `Imagem de ${user.name}`
            
            
            row.querySelector('.table-user p').textContent = user.name
        
            row.querySelector('.table-user a').href = `https://github.com/${user.login}`
            row.querySelector('.table-user span').textContent = `/${user.login}`

            row.querySelector('.table-flw').textContent = user.followers
            row.querySelector('.table-rep').textContent = user.public_repos

            row.querySelector('.remove').onclick = () => {
                const question = confirm('Você deseja excluir este usuário da lista de favoritos ? ')
                if(question)    {
                    this.remove(user)
                }
            }
            this.tbody.append(row)
        })

    }

    Row()   {

        const tr = document.createElement('tr')

        tr.innerHTML =`<tr>
                        <td class="table-user">
                            <img src="https://github.com/CODE-LLAN-BR.png" alt="imagem de LeonardoNunes">
                            <a href="https://github.com/CODE-LLAN-BR" target="_blank">
                                <p>Leonardo Nunes</p>
                                <span>/CODE-LLAN-BR</span>
                            </a>    
                        </td>
                        <td id="repositories" class="table-rep">42</td>
                        <td id="followers" class="table-flw">2</td>
                        <td
                        id="action" class="table-act">
                        <button class = "remove">Remover</button>
                        </td>      
                  </tr>`

                  return tr
                  
    }
    
    emptyRow()  {

        const empty = document.querySelector('.empty')
        empty.id = ''
        
        if (this.entries.length !== 0) {
            empty.id = 'hide'
            
        }
        
    }
    
    trRemove()  {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        }) 
    }
}