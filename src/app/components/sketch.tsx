'use client'; 

import { useRef, useEffect } from 'react';
import p5 from 'p5';



export default function Sketch() {
  const sketchRef = useRef<HTMLDivElement>(null);
 
  function make2DArray(cols: number, rows: number) {
    const arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
      for ( let j =0; j < arr[i].length; j++ ){
        arr[i][j] = 0;
      }
    }
    return arr;
  }
  
  

  useEffect(() => {
    console.log("Sketch mounted")
    let grid: number[][] = [];
    const w = 10;
    let cols: number;
    let rows: number;
    
    let hueValue = 1;

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(800, 800);
        p.colorMode(p.HSB, 360, 255 ,255)
        cols = p.floor(p.width / w);
        rows = p.floor(p.height / w);
        grid = make2DArray(cols, rows);
      };
      
      p.mouseDragged = () => {


        const mouseCol = p.floor(p.mouseX / w);
        const mouseRow = p.floor(p.mouseY / w);
        const matrix = 3
        const extent = p.floor(matrix/2)

        for(let i = -extent; i <= extent; i++){
          for(let j = -extent; j <= extent; j++){
            const col = mouseCol + i
            const row = mouseRow + j
            if(col >= 0 && col < cols && row >= 0 && row < rows){
              grid[col][row] = hueValue
            }
          }
        }
      hueValue += 1;
      if(hueValue > 360){
        hueValue = 1
      }
      }


      p.draw = () =>{
        p.background(0);
        for (let i =0; i < cols; i++) {
          for ( let j = 0; j < rows; j++){
            p.noStroke();
            if(grid[i][j] > 0){
              p.fill(grid[i][j] , 255, 255);
              const x = i * w;
              const y = j * w;
              p.rect(x, y, w);
            }
            
          }
        }
        const nextGrid = make2DArray(cols,rows);

        for(let i = 0; i < cols; i++){
          for(let j = 0; j < rows; j++){
            const state = grid[i][j];
            if(state > 0){
              const dir = p.random([-1, 1])

              const below = grid[i][j+1]
              let belowA,belowB

              if(i + dir >= 0 && i + dir <= cols - 1){
                belowA = grid[i + dir ][j + 1]
              }
              if(i - dir >= 0 && i - dir <= cols - 1){
                belowB = grid[i - dir][j + 1]
              }

              if(below === 0){
                nextGrid[i][j + 1] = grid[i][j];
              } else if( belowA === 0){
                nextGrid[i+dir][j+1] = grid[i][j];
              } else if(belowB === 0){
                nextGrid[i-dir][j+1] = grid[i][j];
              }
              else{
                nextGrid[i][j] = grid[i][j];
              }
            }
          }
        }

        grid = nextGrid;

        
        
      }
      
    };

    
    const p5Instance = new p5(sketch, sketchRef.current!);

    return () => {
      p5Instance.remove(); // cleanup when component unmounts
    };
  }, []);

  return <div ref={sketchRef} className='justify-center mx-auto flex my-4 p-4'></div>;
}