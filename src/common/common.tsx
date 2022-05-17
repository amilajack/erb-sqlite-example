const CommonFunc = {
  isLoading: (state: any, actions: any) => {
    return !!Object.keys(actions).find(
      (key) => !!Object.keys(state).find(rd => state[rd][`isLoading_${actions[key]}`] === true)
    );
  },
};

export default CommonFunc;
