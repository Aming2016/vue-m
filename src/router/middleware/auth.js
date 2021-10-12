export default function guest({ to, next, store }) {
  const { token } = store.state.user;
  if (token) {
    return next();
  } else {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
}
