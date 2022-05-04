export const CommonFunc = {
  isLoading: (state: any, actions: any) => {
    return !!Object.keys(actions).find(key => state[`isLoading_${actions[key]}`] === true);
  }
}
