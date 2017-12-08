import React                           from 'react';
import { connect }                     from 'react-redux';
import Image                           from '@hlj/widget/ImageWithLink';
import {h, diff, patch, createElement} from 'virtual-dom';


const headerImg = require('images/header.jpg');

class Homepage extends React.Component {
  render() {
    return (
      <main>
        <Image src={headerImg} />
        <h1>You made it!</h1>
        <div>edit me in <pre><code>src/pages/home/index.js</code></pre></div>
      </main>
    );
  }
}

export default connect()(Homepage);
