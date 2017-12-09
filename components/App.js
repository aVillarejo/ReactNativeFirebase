import * as firebase from 'firebase';  
import React, { Component } from 'react';
import { View, Text, StyleSheet, AlertIOS } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Input, Item } from 'native-base';
import ListComponent from './ListComponent';

class App extends Component {
    constructor(){
        super();
        
        this.state = {
            nuevo: '',
            lista: [
                        {
                            id: 1,
                            name: 'Tec',
                            done: true
                        }
                    ]
        }
        
    }
    
    changeDone = (item) => {
        console.log(item);
        this.state.lista = this.state.lista.filter(i => i !== item);
        this.state.lista.push(item);
        this.setState({lista: this.state.lista});
    }
    
    agregarItem = () => {
        let nuevo = this.state.nuevo
        nuevo = {id:nuevo,name:nuevo,done:false};
        firebase.database().ref('items').push(nuevo);
        this.state.lista.push(nuevo);
        this.setState({lista: this.state.lista});
        console.log(nuevo);
        
        
    }
    
    listenForItems = (itemsRef) => {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var lista = [];
      snap.forEach((child) => {
        lista.push({
          name: child.val().name,
          done: child.val().done,  
          id: child.key
        });
      });

      this.setState({
        lista: lista
      });

    });
  }
    
    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        this.listenForItems(itemsRef);
      }

    borrar = (item) => {
        let updates = {};
        updates['/items/' + item.id] = null;
        firebase.database().ref().update(updates);
        
    }
    
    render(){
        return(
            <Container>
                <Header>
                    <Left>
                        
                    </Left>
                    <Body>
                        <Title>Fav Places</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                  
                        <Input
                            value={this.state.nuevo}
                            placeholder='Escribe un item nuevo'
                            onChangeText={nuevo=>this.setState({nuevo})}
                            />
                        
               
                    <View style={styles.container}>
                        <ListComponent
                            lista={this.state.lista}
                            changeDone={this.changeDone}
                            borrar={this.borrar}
                            />
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button success
                            full
                            onPress={this.agregarItem}
                            >
                            <Text>Agregar</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    }
});

export default App;

// Initialize Firebase
const firebaseConfig = {  
    apiKey: "AIzaSyCK32Emi3roHLn03wfj3gVrmiCozs_IvKU",
    authDomain: "reactfirebase-a8dab.firebaseapp.com",
    databaseURL: "https://reactfirebase-a8dab.firebaseio.com",
    projectId: "reactfirebase-a8dab",
    storageBucket: "",
    messagingSenderId: "576860207450"
};
const firebaseApp = firebase.initializeApp(firebaseConfig); 