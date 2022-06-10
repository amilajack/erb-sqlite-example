## FEATURES:

- Place your redux business logic per feature here.

### Reducers:

- A reducer definition is responsible to export the action names, action creators and the reducer function itself.

### Services:

- A service contains a list of asynchronous redux actions that are handled by redux-thunk (which should be running in your redux store).

- A feature may expose two particular functions init and start that will be executed the first time you register the service.

- If you are setting up multiple features, first all the init methods will be fired, and only after this init phase all the start methods will run.

- Services functions are completely asynchronous, this let you do all sort of operations, but could be a way to stuck the booting of your app. Be cautious on await!

### Listeners:

- A listener is a way to indirectly associate side effect to a redux action. The basic idea is to use redux as a simple event emitter in our app.
