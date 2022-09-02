import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { client, recommendProfiles, GET_PROFILE ,getPublications} from '../api'

export default function Home() {
  const [profile, setProfile] = useState({})
  const [searchString, setSearchString] = useState('')

 

  async function fetchProfiles() {
    try {
      const response = await client.query(recommendProfiles).toPromise()
      console.log({response})
      setProfiles(response.data.recommendedProfiles)
      //const profiledesc = await client.query(GET_PROFILE,{handle : handleId}).toPromise()
      //console.log({profiledesc})

    } catch (err) {
      console.log('error fetching recommended profiles: ', err)
    }
  }

  async function searchForProfile() {
    try {
      console.log(searchString)
       const response = await client.query(GET_PROFILE, {
         handle: {handle:searchString}
       }).toPromise()
      
  
     
        const pub = await client.query(getPublications, { id: response.data.profile.id, limit: 1,publicationTypes: "POST" }).toPromise()
        console.log("pub",pub)   
        //response.data.profile.publication = pub.data.publications.items[0]
        response.data.profile.publications = pub.data.publications.items


        
    

      
      setProfile(response.data.profile)
    } catch (err) {
      console.log('error searching profiles...', err)
    }
  }

  
  console.log({ profile})

  return (
    <div>
      <input
          placeholder='Search'
          onChange={e => setSearchString(e.target.value)}
          value={searchString}
        />
        <button
          onClick={searchForProfile}
        >SEARCH PROFILE By HANDLE</button>
        <div style={{padding:"100px"}}>
        <a>
                  {
                    profile.picture ? (
                      <Image
                        src={profile.picture.original.url}
                        width="100px"
                        height="100px"
                      />
                    ) : <div style={blankPhotoStyle} />
                  }
                  
                  <p>Id: {profile.id}</p>
                  <p>Handle: {profile.handle}</p>
                  <p>Name: {profile.name}</p>
                  <p>Bio: {profile.bio}</p>
                  <p>Publications:</p>
                  <div>
                  {profile.publications.map(function(publication, index){
                    return (<li style={post} key={index}>{publication.metadata.content}</li>)
                    })}
                  </div>

                  </a>
          

        </div>
   </div>
  )
}

const blankPhotoStyle = {
  width: '52px',
  height: '52px',
  backgroundColor: 'white'
}

const post ={
  backgroundColor: '#eee',
  margin: '2rem',
  padding: '1rem',
}