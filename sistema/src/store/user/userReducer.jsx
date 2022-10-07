const initialState={
    userData:{}
}
const reducerUser = (state=initialState, action)=>{
    switch(action.type){
        case 'USER_DATA_JEONSA':
            return{
                ...state,
                userData:action.userData
            }
            default:
                return state
    }
}

export{
    reducerUser
}