import * as React from 'react';
import './App.css';
import * as THREE from 'three';
import Card from 'material-ui/Card';
import { withStyles, WithStyles } from 'material-ui/styles';
import { StyleRules } from 'material-ui/styles/withStyles';
import CardContent from 'material-ui/Card/CardContent';
import Typography from 'material-ui/Typography/Typography';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import Divider from 'material-ui/Divider/Divider';
import Avatar from 'material-ui/Avatar/Avatar';

const styles: StyleRules<'card'|'container'> = {
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
  }
};

type ClassNames = keyof typeof styles;

type Props = {

};

class App extends React.Component<WithStyles<ClassNames>&Props> {

  animate(meshList: Array<any>, 
          renderer: THREE.WebGLRenderer, 
          camera: THREE.PerspectiveCamera, 
          scene: THREE.Scene) {

          renderer.render(scene, camera);
          for (let i = meshList.length; --i ;) {
            const meshObj = meshList[i];
            const speed = meshObj.speed;
            const mesh = meshObj.mesh;
            mesh.position.z = meshObj.mesh.position.z + speed;
            if (mesh.position.z > 0) {
                mesh.position.z = -1000;
                mesh.position.x = 3 * ( Math.random() * 1000 - 500 );
                mesh.position.y = 3 * ( Math.random() * 600 - 300 );
                meshObj.speed = Math.random() * 10 + 5;
            }
          }
          camera.updateMatrix();
          requestAnimationFrame(() => {
            this.animate(meshList, renderer, camera, scene);
          });
  }

  loadThree = (element: HTMLDivElement) => {
    const width = element.clientWidth - 10; // canvas width
    const height = document.body.clientHeight - 10; // canvas height
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.set(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({
          preserveDrawingBuffer: true ,
          antialias: true, 
      });
    renderer.setSize( width, height );
    renderer.render(scene, camera);
    element.appendChild(renderer.domElement);
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 2);
    directionalLight.position.set(0, 0, 50);
    scene.add(directionalLight);
    scene.fog = new THREE.Fog(0x000000,  
                              0.010,    
                              800);    
    var geometry = new THREE.SphereGeometry( 1, 1, 1 );
    const s = 3;
    const meshList = [];
    for ( var i = 0; i < 3000; i ++ ) {
      const depthMaterial = new THREE.MeshPhongMaterial({
        color: Math.floor(Math.random() * 0xFFFFFF),
        specular: 0xfffff,
        shininess: 100
      });
      var object = new THREE.Mesh( geometry, depthMaterial );
      object.position.x = s * ( Math.random() * 1000 - 500 );
      object.position.y = s * ( Math.random() * 600 - 300 );
      object.position.z = s * -300;
      object.scale.x = Math.random() * 2 + 1;
      object.scale.y = Math.random() * 2 + 1;
      object.scale.z = Math.random() * 2 + 1;
      object.updateMatrixWorld(true);
      scene.add(object);
      meshList.push({
       speed: Math.random() * 10 + 3,
        mesh: object
      });
    }
    this.animate(meshList, renderer,  camera, scene);

    window.addEventListener('resize', () => {
      const w = element.clientWidth - 10; // canvas width
      const h = document.body.clientHeight - 10; // canvas height
      renderer.setSize(w, h);
      camera.aspect = w / h;
    });
  }

  linkTo = (link: string) => {
    window.location.href = link;
  }

  render() {
    return (
      <div className="App">
        <div ref={this.loadThree}/>
        <div className={this.props.classes.container}>
        <Card className={this.props.classes.card}>
          <CardContent>
            <Typography variant="title" >
              TMKNYM
            </Typography>
            <Divider />
            <ListItem button={true} onClick={this.linkTo.bind(this, 'https://www.facebook.com/tomoaki.kanayama.3')}>
              <Avatar alt="fb"  src={require('./images/fb.png')}/>
              <ListItemText primary="Facebook"  />
            </ListItem>
            <ListItem button={true} onClick={this.linkTo.bind(this, 'https://500px.com/tomoakikanayama')}>
              <Avatar alt="500"  src={require('./images/500.svg')}/>
              <ListItemText primary="500px"  />
            </ListItem>
          </CardContent>
        </Card>
        </div>
      </div>
    );
  }
}

export default withStyles<{}&ClassNames>(styles)<Props>(App);
