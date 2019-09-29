import { patch, h } from 'superfine';

const node = document.getElementById('app');

const setState = state => {
  patch(
    node,
    h('div', {}, [
      h('h1', {}, state),
      h('button', { onClick: () => setState(state - 1) }, '-'),
      h('button', { onClick: () => setState(state + 1) }, '+'),
    ])
  );
};

setState(0); // Start app with the initial state.
