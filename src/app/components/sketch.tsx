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


    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(400, 400);
        cols = p.floor(p.width / w);
        rows = p.floor(p.height / w);
        grid = make2DArray(cols, rows);
        grid[20][10] = 1
      };
      
      p.mouseDragged = () => {
        const col = p.floor(p.mouseX / w);
        const row = p.floor(p.mouseY / w);
        if(col >= 0 && col < cols && row >= 0 && row < rows){
          grid[col][row] = 1;
        }
      }

      p.draw = () =>{

        p.background(0);
        for (let i =0; i < cols; i++) {
          for ( let j = 0; j < rows; j++){
            p.noStroke();
            if(grid[i][j] == 1){
              p.fill(255);
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
            if(state === 1){
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
                nextGrid[i][j + 1] = 1;
              } else if( belowA === 0){
                nextGrid[i+dir][j+1] = 1;
              } else if(belowB === 0){
                nextGrid[i-dir][j+1] = 1;
              }
              else{
                nextGrid[i][j] = 1;
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

  return <div ref={sketchRef}></div>;
}