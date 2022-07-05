import { useEffect, useState } from 'react';
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png';
import { Button } from './componentes/button';
import { InfoItem } from './componentes/infoitem';
import { items } from './data/items';
import  Restarticon from './svgs/restart.svg';
import { GridIntemType } from './types/GridItemTypes';
import { GridItem } from './componentes/Grinditem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';


const App = () =>{
  //Logica do Jogo
  const [playing, setPlaying] = useState<boolean>(false);
  // Logica do Tempo do Jogo
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  // Logica dos Movimentos do Jogo
  const [moveCount, setMoveCount] = useState<number>(0);
  // Logica das Cartas
  const [shownCount, setShownCount] = useState<number>(0);
  // Logica do GridItem
  const [gridItems, setGridItems] = useState<GridIntemType[]>([]);

  // Uso do UseEffect
  useEffect(() => resetEndCreatGrid(), []);


  //Tempo do Jogo
  useEffect (() =>{
    const timer = setInterval(()=>{

      if(playing){ setTimeElapsed(timeElapsed + 1); }
    }, 1000);
    return() => clearInterval(timer);
  },[playing, timeElapsed]);
  
  // Verify if opened are equal
  useEffect(() => {
    if(shownCount === 2){
      let opened =  gridItems.filter(items => items.shown === true);
      if(opened.length === 2){

        

        if(opened[0].item === opened[1].item){
          // v1 if both are equal, make every "shon" permanent
          let tmpGrid = [...gridItems];
          for(let i in tmpGrid){
            if(tmpGrid[i].shown){
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].shown = false;

            }
            
          }
          setGridItems(tmpGrid);
          setShownCount(0);
         
        } else{
          // v2 if they are NOT equal, close All 'shown
          setTimeout(()=>{
            let tmpGrid = [...gridItems];
          for( let i in tmpGrid){
            tmpGrid[i].shown = false
          }
          setGridItems(tmpGrid);
          setShownCount(0);
          }, 1000)
        }
        setMoveCount(moveCount => moveCount + 1)
      }
    }
  }, [shownCount, gridItems])

  // verufy if game Over

  useEffect(() =>{
    if(moveCount > 0 && gridItems.every(item => item.permanentShow === true)){
      setPlaying(false);
      alert("Fim de Jogo");
    }

  }, [moveCount, gridItems]);

  // Função do Grid
  const resetEndCreatGrid = () =>{
    // Passo 1 - Resetando o Jogo

    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    // Passo 2 - Cria o Grid e Começar o Jogo
    // 2.1 Cria um Grid Vazio
      let tmpGrid: GridIntemType[] = [];
      for(let i = 0; i < (items.length * 2); i++) tmpGrid.push({
        item:null, shown: false, permanentShow: false
      });
    // Passo 2.2 Preencher o Grid

      for(let w = 0; w < 2; w++){
        for (let i = 0; i < items.length; i++){
          let pos = -1;
          while (pos < 0 || tmpGrid[pos].item !== null){
            pos = Math.floor(Math.random() * (items.length * 2));
          }
          tmpGrid[pos].item = i;
        }
      }

    // Passo 2.3 Jogar no state
      setGridItems(tmpGrid);
    // Passo 3 Começar o Jogo
      setPlaying(true);
  }

  const handeldClick = (index: number) => {
    if(playing && index !== null && shownCount < 2){
      let tempGrid = [...gridItems];
      
      if(tempGrid[index].permanentShow === false && tempGrid[index].shown === false){
        tempGrid[index].shown = true;
        setShownCount(shownCount + 1);
      }
      setGridItems(tempGrid);

    }
  }
  return(
    <C.Container>
      <C.Info>
          <C.LogoLink>
            <img src={logoImage} width="200" alt="" />
          </C.LogoLink>

          <C.InfoArea>
            <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)}/>
            <InfoItem label='Movimentos' value={moveCount.toString()}/>
          </C.InfoArea>
          
          <Button label='Reiniciar' icon={Restarticon} onClick={resetEndCreatGrid} />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=>(
              <GridItem 
                key={index}
                item={item}
                onClick={() =>handeldClick(index)}
              />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}
export default App;
