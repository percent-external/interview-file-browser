import React, { useEffect, useState } from "react";
import "./App.css";
import {useListEntriesQuery } from "./generated-api";
import { Table } from "./Components/Table";
import ClipLoader from "react-spinners/ClipLoader"; //Great library for loading, super simple and quick
import DirectoryStack from "./utils/directoryStack.js";
import { DirectoryInfo } from "./Components/DirectoryInfo";
import { NEXT_PAGE, PREV_PAGE, ROOT_PATH } from "./utils/constants";


//Basically the main component for everything, controls the additional info component and the directory table


const directoryStack = new DirectoryStack();
directoryStack.push(ROOT_PATH);

const App=()=> {
  
  
  const[currDirectory,setCurrDirectory] = useState<string>(ROOT_PATH)
  const[currPage,setCurrPage] = useState<number>(1);
  const[fileClicked,setFileClicked] = useState<File | null>();

  const { data, loading, error,refetch } = useListEntriesQuery({
    variables: { path:directoryStack.peek(),page:currPage},
  });

  //Pass in to go forward or backward for the pages
  const changePage = (direction:string)=>{

    if(data?.listEntries){
      switch(direction){
        case(NEXT_PAGE):
            if(currPage >= data?.listEntries?.pagination?.pageCount){
              return;
            }
            setCurrPage(currPage+1);
          break;
        case(PREV_PAGE):
          if(currPage <= 1){
            return;
          }
          setCurrPage(currPage-1);
          break;
      }
    }
    return;
    

  }

  const goBackDirectory=()=>{
    if(directoryStack.length()==1){   //We don't want to go to even before /
      return;
    }
    directoryStack.pop();
    setCurrDirectory(directoryStack.peek());
  }

  const goUpDirectory = (path:string)=>{
    directoryStack.push(path);
    setCurrDirectory(path);
  }

  //Whenever the currDirectory or page is updated, refetch the data from the hook
  useEffect(()=>{
    setFileClicked(null);
    refetch();
  },[currDirectory,currPage])

  useEffect(()=>{
    setCurrPage(1);
  },[currDirectory])

 
  if(error){return <p>There was an error!</p>}
  return (
    <div className="App">
      {loading ? 
        <ClipLoader size={200}/>
        :
        <>
           <Table 
              data={data}
              fileClicked={fileClicked}
              setFileClicked={setFileClicked} 
              currDirectory={currDirectory} 
              goUpDirectory={goUpDirectory} 
              goBackDirectory={goBackDirectory} 
              changePage={changePage}
              currPage={currPage}
              
            />


            <div style={{height:'250px'}}>
                {directoryStack.peek() != ROOT_PATH &&
                  <DirectoryInfo data = {data} fileClicked={fileClicked}/>
                }
            </div>
        </>
       


      } 
     
      
      
    </div>
  );
}

export default(App);

