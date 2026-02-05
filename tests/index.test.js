const { default: axios2, put } = require("axios")
const { json } = require("express")
const { WebSocket } = require("ws")
const Backend_Url='http://localhost:3000'
const Ws_Url='ws://localhost:8080'
//axios trhrow error for every 400,403 call so our test not able to run --> to solve it either put each axios call in try and catch or use fetch or
//wrapping Axios so tests don’t crash so basically we are wrapping tests in try and catch and returning response which later check in expect 
const axios={
post:async(...args)=>{
  try {
   const res= await axios2.post(...args)
   return res
  } catch (error) {
    return error.response
  }
},
put:async(...args)=>{
  try {
   const res= await axios2.put(...args)
   return res
  } catch (error) {
    return error.response
  }
},
get:async(...args)=>{
  try {
   const res= await axios2.get(...args)
   return res
  } catch (error) {
    return error.response
  }
},
delete:async(...args)=>{
  try {
   const res= await  axios2.delete(...args)
   return res
  } catch (error) {
    return error.response
  }
}
  
}
// describe("Authorization",()=>{
//     test('signUp test', async() => { 
//         const username= `Ankur-${Math.random()}`
//         const password="12345678"
//         console.log(username,password)
//      const response = await axios.post(`${Backend_Url}/api/v1/signup`,{
//         username,
//         password,
//         role:"Admin"
//      })
//      expect(response.status).toBe(200);
//      const updatedresponse = await axios.post(`${Backend_Url}/api/v1/signin`,{
//         username,
//         password
//      })
//      expect(updatedresponse.status).toBe(200);
//      })
//     test('signUp test failed as username empty', async() => { 
     
//         const password="12345678"
//      const response = await axios.post(`${Backend_Url}/api/v1/signup`,{
//         password
//      })
     
//      expect(response.status).toBe(400);
//      })
//      test('signin test when username and password are correct  ',async()=>{
//       const username = `AnkurDeep-${Math.random()}`
//       const password="1234678"
//       const response = await axios.post(Backend_Url+"/api/v1/signup",{
//         username,
//         password,
//          role:"Admin"
//       })
//       const sign= await axios.post(`${Backend_Url}/api/v1/signin`,{
//         username,
//         password
//       })
//       expect(sign.status).toBe(200);
//       expect(sign.data.token).toBeDefined();
//      })
//      test('signin fail when  username and password are incorrect  ',async()=>{
//       const username = `AnkurDeep-${Math.random()}`
//       const password="123467"
//       const response = await axios.post(Backend_Url+"/api/v1/signup",{
//         username,
//         password,
         
//       })
//       const sign= await axios.post(`${Backend_Url}/api/v1/signin`,{
//         username:"sdfghj",
//         password
//       })
//       expect(sign.status).toBe(400);
     
//      })

// })

describe("User metadata(avatar) update",()=>{
  //these endpoint need token
  let token=""
  let avatarId=""
  beforeAll(async()=>{
    const username =`Ank-${Math.random()}`
    const password ="12345678"
   await axios.post(`${Backend_Url}/api/v1/signup`,{
    username,
    password,
    role:"Admin"
   })
   const response = await axios.post(`${Backend_Url}/api/v1/signin`,{
    username,
    password,
   })
   const token = response.data.token
   //as user signup is admin so he can create a avatar
   const avatarResponse = await axios.post(`${Backend_Url}/api/v1/admin/avatar`,{
   	"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
	"name": "Timmy"},{
    headers:{
     "authorization":`Bearer ${token}`
    }})
  avatarId =avatarResponse.data.avatarId
  })
  test("user can't update  their metadata as wrong avatar id ",async()=>{
    const response = await axios.post(`${Backend_Url}/api/v1/user/metadata`,{
     avatarId:"234567890"
   },{
    headers:{
     "authorization":`Bearer ${token}`
    }
   })
   expect(response.status).toBe(400);
  })
  test("user can update their avatar when correct avatar id is provided",async()=>{
     const response = await axios.post(`${Backend_Url}/api/v1/user/metadata`,{
     avatarId
   },{
    headers:{
     "authorization":`Bearer ${token}`
    }
   })
    expect(response.status).toBe(200);
  })
  test("user cannot update their avatar as no header provided ",async()=>{
     const response = await axios.post(`${Backend_Url}/api/v1/user/metadata`,{
     avatarId
   })
   expect(response.status).toBe(403);
  })
})
// describe(" avatar information of User",()=>{
// let token=""
// let avatarId=""
// let userId=""
//   beforeAll(async()=>{
//     const username =`Ank-${Math.random()}`
//     const password ="12345678"
//   const signUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username,
//     password,
//     role:"Admin"
//    })
//    userId= signUpResponse.data.userId
//    const response = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username,
//     password,
//    })
//    token = response.data.token
//    //as user signup is admin so he can create a avatar
//    const avatarResponse = await axios.post(`${Backend_Url}/api/v1/admin/avatar`,{
//    	"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
// 	"name": "Timmy"},{
//     headers:{
//      "authorization":`Bearer ${token}`
//     }})
//   avatarId =avatarResponse.data.avatarId
   
//   })
//   //these test  are unauthenticated
//    test(" get back   avatar information for user ",async()=>{
//  const response= await axios.get(`${Backend_Url}/api/v1/user/metadata/bulk?ids=[${userId}]`)
//   expect(response.data.avatars.length).toBe(1);
//   })


//   test(" get back  all avatar information for user ",async()=>{
//  const response= await axios.get(`${Backend_Url}/api/v1/avatars`)
//   const currAvatar = response.data.avatars.filter(x=>x.id==avatarId)
//   expect(currAvatar).toBeDefined()
//   expect(response.data.avatars.length).not.toBe(0);
//   })
 

// })
// describe("Space information",()=>{
//   let mapId;
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;
//   let element1Id;
//   let element2Id;
// beforeAll(async()=>{
//    const username =`Ank-${Math.random()}`
//     const password ="12345678"
//   const signUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username,
//     password,
//     role:"Admin"
//    })
//    adminId= signUpResponse.data.userId
//    const response = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username,
//     password,
//    })
//    adminToken = response.data.token
//    //user auth as  admin create map & element  than only user can create space  
//   const userSignUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//    username:username+"-user",
//     password,
//     role:"User"
//    })
//    userId= userSignUpResponse.data.userId
//    const userSiginResponse = await axios.post(`${Backend_Url}/api/v1/signin`,{
//      username:username+"-user",
//     password,
//    })
//    userToken = userSiginResponse.data.token

//    const element1Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    const element2Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    element1Id=element1Response.data.id
//    element2Id=element2Response.data.id
//    const mapResponse = await axios.post(`${Backend_Url}/api/v1/admin/map`,{
//   "thumbnail": "https://thumbnail.com/a.png",
//    "dimensions": "100x200",
//    "name": "100 person interview room",
//    "defaultElements": [{
// 		   elementId: element1Id,
// 		   x: 20,
// 		   y: 20
// 	   }, {
// 	     elementId: element1Id,
// 		   x: 18,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }
//    ]
//    },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
//    mapId=mapResponse.data.id

// })
// test("test if user is able to create space",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  expect(response.data.spaceId).toBeDefined()
// })
// test("test if user isnot  able to create space without mapId",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//    "dimensions": "100x200",
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  expect(response.status).toBe(400)
// })
// test("test if user is not  able to create space without mapId and  dimentions",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  expect(response.status).toBe(400)
// })
// test("test if user is not  able to delete a random  space",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space/randomId`,{
//    "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  expect(response.status).toBe(400);
// })
// test("test if user is able to  delete a space",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  expect(response.data.spaceId).toBeDefined()
//  const deleteResponse = await axios.delete(`${Backend_Url}/api/v1/space/${response.data.spaceId}`,{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//   expect(deleteResponse.status).toBe(200)
// })

// test("test if user is not  able to delete a space created by other user",async()=>{
// const response = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//  },{
//   headers:{
//     authorization:`Bearer ${adminToken}`
//   }
//  })
//  expect(response.status).toBe(400)
// })
// test("admin has no space initially ",async()=>{
//     const response = await axios.get(`${Backend_Url}/api/v1/space/all`,{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//     expect(response.data.spaces.length).toBe(0);
// })
// test("admin has all space  that are created by user ",async()=>{
//   const spaceResponse = await axios.post(`${Backend_Url}/api/v1/space`,{
//    "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//  },{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  })
//  const space=spaceResponse.data.spaceId
//     const response = await axios.get(`${Backend_Url}/api/v1/space/all`,{
//   headers:{
//     authorization:`Bearer ${userToken}`
//   }
//  } )
//     const filteredSpace= response.data.spaces.filter(x=>x.id==space);
//     expect(response.data.spaces.length).toBe(1);
//     expect(filteredSpace).toBeDefined();
// })

// })
// describe("Arena endpoint ",()=>{
//  let mapId;
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;
//   let element1Id;
//   let element2Id;
//   let spaceId;
// beforeAll(async()=>{
//    const username =`Ank-${Math.random()}`
//     const password ="12345678"
//   const signUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username,
//     password,
//     role:"Admin"
//    })
//    adminId= signUpResponse.data.userId
//    const response = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username,
//     password,
//    })
//    adminToken = response.data.token
//    //user auth as  admin create map & element  than only user can create space  
//   const userSignUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username:username+"-user",
//     password,
//     role:"User"
//    })
//    userId= userSignUpResponse.data.userId
//    const userSiginResponse = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username:username+"-user",
//     password,
//    })
//    userToken = userSiginResponse.data.token

//    const element1Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    const element2Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    element1Id=element1Response.data.id
//    element2Id=element2Response.data.id
//    const mapResponse = await axios.post(`${Backend_Url}/api/v1/admin/map`,{
//   "thumbnail": "https://thumbnail.com/a.png",
//    "dimensions": "100x200",
//    "name": "100 person interview room",
//    "defaultElements": [{
// 		   elementId: element1Id,
// 		   x: 20,
// 		   y: 20
// 	   }, {
// 	     elementId: element1Id,
// 		   x: 18,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }
//    ]
//    },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
//    mapId=mapResponse.data.id
//    const spaceResponse = await axios.post(`${Backend_Url}/api/v1/space`,{
//      "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//    },{
//     headers:{
//       authorization:`Bearer ${userToken}`
//     }
//    })
//    spaceId=spaceResponse.data.spaceId
// })

// test("incorrect spaceId return nothing 400",async()=>{
//  const space = await axios.get(`${Backend_Url}/api/v1/space/234567`,{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })
//  expect(space.status).toBe(400)

// })
// test("correct spaceId return all element and 200",async()=>{
//  const space = await axios.get(`${Backend_Url}/api/v1/space/${spaceId}`,{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })
//  expect(space.dimensions).toBe("100x200")
//  //100x200 is the dimensions of space we created 
//   expect(space.data.elements.length).toBe(3)
// })
// test("delete endpoint  delete an element ",async ()=>{
//   const space = await axios.get(`${Backend_Url}/api/v1/space/${spaceId}`,{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })
//  const elemtToDelete = await axios.delete(`${Backend_Url}/api/v1/space/element`,{
//   spaceId,
//   elementId:space.data.elements[0]
//  },{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })
// //space.data.elements[0] --> delete 1st element
// //so after deleting now length becomes 2 as previous was 3 
//  const spaceLengthCheck = await axios.get(`${Backend_Url}/api/v1/space/${spaceId}`,{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })
//   expect(spaceLengthCheck.data.elements.length).toBe(2)
// })
// test("adding an element end point works fine",async()=>{
//  const response = await axios.post(`${Backend_Url}/api/v1/space/element`,{
  
//   "elementId": element1Id,
//   "spaceId": spaceId,
//   "x": 50,
//   "y": 20
//  },{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })

//  expect(response.data.elements.length).toBe(3)
// })
// test("adding an element end point fails as dimension are worng",async()=>{
//  const response = await axios.post(`${Backend_Url}/api/v1/space/element`,{
  
//   "elementId": element1Id,
//   "spaceId": spaceId,
//   "x": 50000,
//   "y": 2000
//  },{
//   headers:{
//     "authorization":`Bearer ${userToken}`
//   }
//  })

//  expect(response.status).toBe(400)
// })

// })
// describe("admin endpoint",()=>{
//   let adminId;
//   let adminToken;
//   let userId;
//   let userToken;
// beforeAll(async()=>{
//    const username =`Ank-${Math.random()}`
//     const password =12345678
//   const signUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username,
//     password,
//     role:"Admin"
//    })
//    adminId= signUpResponse.data.userId
//    const response = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username,
//     password,
//    })
//    adminToken = response.data.token
//    //user auth as  admin create map & element  than only user can create space  
//   const userSignUpResponse= await axios.post(`${Backend_Url}/api/v1/signup`,{
//     username:username+"-user",
//     password,
//     type:"User"
//    })
//    userId= userSignUpResponse.data.userId
//    const userSiginResponse = await axios.post(`${Backend_Url}/api/v1/signin`,{
//     username:username+"-user",
//     password,
//    })
//    userToken = userSiginResponse.data.token
// })
// test("admiin is not able to hit admin endpoint",async()=>{
//    const elementResponse= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${userToken}`
//     }
//    })
   
//    const mapResponse = await axios.post(`${Backend_Url}/api/v1/admin/map`,{
//   "thumbnail": "https://thumbnail.com/a.png",
//    "dimensions": "100x200",
//    "name": "100 person interview room",
//    "defaultElements": []
//    },{
//     headers:{
//       authorization:`Bearer ${userToken}`
//     }
//    })
//    const avatarResponse = await axios.post(`${Backend_Url}/api/v1/admin/avatar`,{
// 	"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
// 	"name": "Timmy"
// },{
//     headers:{
//       authorization:`Bearer ${userToken}`
//     }
//    })
//    const updateElementResponse = await axios.put(`${Backend_Url}/api/v1/admin/element/123`,{
// 	"imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
// },{
//     headers:{
//       authorization:`Bearer ${userToken}`
//     }
//    })

//    expect(elementResponse.status).toBe(403)
//    expect(mapResponse.status).toBe(403)
//    expect(avatarResponse.status).toBe(403)
//    expect(updateElementResponse.status).toBe(403)
// })
// test("admiin is  able to hit admin endpoint",async()=>{
//    const elementResponse= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
   
//    const mapResponse = await axios.post(`${Backend_Url}/api/v1/admin/map`,{
//   "thumbnail": "https://thumbnail.com/a.png",
//    "dimensions": "100x200",
//    "name": "100 person interview room",
//    "defaultElements": []
//    },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
//    const avatarResponse = await axios.post(`${Backend_Url}/api/v1/admin/avatar`,{
// 	"imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
// 	"name": "Timmy"
// },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
   
//    expect(elementResponse.status).toBe(200)
//    expect(mapResponse.status).toBe(200)
//    expect(avatarResponse.status).toBe(200)
 
// })
// test("admin is able to update image url for a element",async()=>{
//  const elementResponse= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//     const updateElementResponse = await axios.put(`${Backend_Url}/api/v1/admin/element/${elementResponse.data.id}`,{
// 	"imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"	
// },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
//    expect(updateElementResponse.status).toBe(200)
// })


// })
// describe("websocket",()=>{
//   let adminToken;
// let adminId;
// let userId;
// let userToken;
// let element1Id;
// let element2Id;
// let spaceId;
// let mapId;
// let ws1;
// let ws2;
// let ws1Message=[];
// let ws2Message=[];
// let userX;
// let userY;
// let adminX;
// let adminY;

// //if message are here in ws1MessageArray or ws2Array than git lefy most element otherwise wait for some interval and than give left most element
// function waitForAndPopLatestMessage(messageArray){
//   return new Promise(r=>{
//     if(messageArray.length>0){
//       r(messageArray.shift())
//     }else{
//       let  interval =
//         setInterval(()=>{
//  if(messageArray.length>0){
//       r(messageArray.shift())
//       clearInterval(interval)
//     }
//         },100)
      
//     }
//   })
// }
//  async function httpSetup(){

// const username =`ank+${Math.random()}`;
// const password ='12345'
// const adminSignUpResponse = await axios.post(`${Backend_Url}/ap1/v1/signup`,{
//   username:username,
//   password,
//   role:'Admin'
// })
// const adminSignInResponse = await axios.post(`${Backend_Url}/ap1/v1/signin`,{
//   username:username,
//   password,
// })
// adminId=adminSignUpResponse.data.userId;
// adminToken=adminSignInResponse.data.token
// const userSignUpResponse = await axios.post(`${Backend_Url}/ap1/v1/signup`,{
//   username:username+"deep",
//   password,
//   role:"User"
// })
// const userSignInesponse = await axios.post(`${Backend_Url}/ap1/v1/signin`,{
//   username:username+"deep",
//   password,
// })

// userId=userSignUpResponse.data.userId
// userToken=userSignInesponse.data.token

//    const element1Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    const element2Response= await axios.post(`${Backend_Url}/api/v1/admin/element`,{
//     "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
// 	  "width": 1,
// 	"height": 1,
//   "static": true 
//    },{
//     headers:{
//       "authorization":`Bearer ${adminToken}`
//     }
//    })
//    element1Id=element1Response.data.id
//    element2Id=element2Response.data.id
//    const mapResponse = await axios.post(`${Backend_Url}/api/v1/admin/map`,{
//   "thumbnail": "https://thumbnail.com/a.png",
//    "dimensions": "100x200",
//    "name": "100 person interview room",
//    "defaultElements": [{
// 		   elementId: element1Id,
// 		   x: 20,
// 		   y: 20
// 	   }, {
// 	     elementId: element1Id,
// 		   x: 18,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }, {
// 	     elementId: element2Id,
// 		   x: 19,
// 		   y: 20
// 	   }
//    ]
//    },{
//     headers:{
//       authorization:`Bearer ${adminToken}`
//     }
//    })
//    mapId=mapResponse.data.id
//    const spaceResponse = await axios.post(`${Backend_Url}/api/v1/space`,{
//      "name": "Test",
//    "dimensions": "100x200",
//    "mapId": mapId
//    },{
//     headers:{
//       authorization:`Bearer ${userToken}`
//     }
//    })
//    spaceId=spaceResponse.data.spaceId
//   }
// async function wsSetup(){
//   ws1=new WebSocket(`${Ws_Url}`)
//   ws2=new WebSocket(`${Ws_Url}`)
//   await new Promise(r=>{
//     ws1.onopen=r;
//   })
//     ws1.onmessage((event)=>{
//   ws1Message.push(json.parse(event.data))
//   })
//   await new Promise(r=>{
//     ws2.onopen=r;
//   })

//   ws2.onmessage((event)=>{
//   ws2Message.push(json.parse(event.data))
//   })

// }
// beforeAll(async()=>{
// httpSetup();
// wsSetup();
// })
// test("get back ack for joining a space ",async()=>{
// ws1.send(JSON.stringify({
//    "type": "join",
//     "payload": {
// 	    "spaceId": spaceId,
// 	    "token": adminToken
//     }
// }))
// const message1= await waitForAndPopLatestMessage(ws1Message);
// ws2.send(JSON.stringify({
//    "type": "join",
//     "payload": {
// 	    "spaceId": userId,
// 	    "token": userToken
//     }
// }))

// const message2 =await waitForAndPopLatestMessage(ws2Message);
// const message3= await waitForAndPopLatestMessage(ws1Message);// as ws2 join so ws1 array would have another message which is join event of user2
// expect(message1.type).toBe("space-joined");
// expect(message2.type).toBe("space-joined");
// expect(message1.payload.users.length).toBe(0);//because of ordering as ws1 first coonect so its users array has 0 user
// expect(message2.payload.users.length).toBe(1);//as ws2  coonect after ws1 so its users has 1 length (as ws1 user as user 1
// expect(message3.type).toBe("user-join");
// expect(message3.payload.userId).toBe(userId);
// expect(message3.payload.x).toBe(message2.payload.spawn.x);
// expect(message3.payload.y).toBe(message2.payload.spawn.y);

// adminX=message1.payload.spawn.x
// adminY=message1.payload.spawn.y
// userX=message2.payload.spawn.x
// userY=message2.payload.spawn.y
// })


// test("user should not be able to move across the boundary of space",async()=>{
// ws1.send(JSON.stringify({
//    "type": "move",
//     "payload": {
// 	    "x": 200000,
// 	    "y": 3000000
//     }
// }))
// const message= await waitForAndPopLatestMessage(ws1Message);
// expect(message.type).toBe("movement-rejected");
// expect(message.payload.x).toBe(adminX);
// expect(message.payload.y).toBe(adminY);
// })
// test("user should not be able to move 2  block at a time",async()=>{
// ws1.send(JSON.stringify({
//    "type": "move",
//     "payload": {
// 	    "x": adminX+2,
// 	    "y": adminY
//     }
// }))
// const message= await waitForAndPopLatestMessage(ws1Message);
// expect(message.type).toBe("movement-rejected");
// expect(message.payload.x).toBe(adminX);
// expect(message.payload.y).toBe(adminY);
// })

// test("correct movement shiuld be broadcasted to other socket in the room",async()=>{
// ws1.send(JSON.stringify({
//    "type": "move",
//     "payload": {
// 	    "x": adminX+1,
// 	    "y": adminY,
//       "userId":adminId
//     }
// }))
// const message= await waitForAndPopLatestMessage(ws2Message);
// expect(message.type).toBe("movement");
// expect(message.payload.x).toBe(adminX+1);
// expect(message.payload.y).toBe(adminY);
// })
// test("if one user  leave other user get a user-left event",async()=>{
// ws1.close();
// const message= await waitForAndPopLatestMessage(ws2Message);
// expect(message.type).toBe("user-left");
// expect(message.payload.userId).toBe(adminId)
// })
// })

