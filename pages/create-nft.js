import { useState } from 'react'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Web3Modal from 'web3modal'

//const client = create('https://ipfs.infura.io:5001/api/v0')  //2023.09.24
//INFURA_IPFS_PROJECT_ID="2Vp52vGoUlF8tUJMD1QFALyJkV6"
//INFURA_IPFS_PROJECT_SECRET="09b9196a25ae7c141bc1b94996c279fc"
//const projectId = process.env.INFURA_IPFS_PROJECT_ID  //2023.09.24
//const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET  //2023.09.24
const projectId = '2Vp52vGoUlF8tUJMD1QFALyJkV6'
const projectSecret = '09b9196a25ae7c141bc1b94996c279fc'
const projectIdAndSecret = `${projectId}:${projectSecret}`
const auth = `Basic ${Buffer.from(projectIdAndSecret).toString('base64')}`

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization: auth,
    },
})

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      console.log('Added object:', added)

      const url = `https://agriner.infura-ipfs.io/ipfs/${added.path}`   //20230924
      setFileUrl(url)   //2023.09.24
      console.log('File URL:', url)
     /* client.pin.add(added.path).then((res) => {
        console.log(res)
        setFileUrl(url)
      })*/
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://agriner.infura-ipfs.io/ipfs/${added.path}`  //2023.09.24
      
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    console.log('Listing NFT file URL:', url)
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && ( 
            <div style={{width: '100%', height: '100%', position: 'relative'}}>
               <Image unoptimized className="rounded mt-4" layout="fill" src={fileUrl} />
            </div>
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}