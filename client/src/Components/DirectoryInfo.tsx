
import React, { Props } from "react";
import styled from "styled-components";
import { ListEntriesResult,ListEntriesQuery } from "../generated-api";


interface DirectoryInfo{
    data?:ListEntriesQuery,
    fileClicked?:File | null,
}

const DirectoryTable = styled.div`
    border: 1px solid gray;
    width: 400px;
    height:100%;
    
`;



export const DirectoryInfo:React.FC<DirectoryInfo>=({data,fileClicked})=>{

    const listEntries = data?.listEntries;
    const entries = listEntries?.entries || [];


    //This reduce function basically just adds all of file sizes in the directory and then displays them
    const sizeOfAllFiles = entries.reduce((acc:any,currVal:any)=>{
        return(acc + currVal.size)
    },0)
    return(
        <DirectoryTable>
            <h2>Number of files: {entries.length}  </h2>
            {!!sizeOfAllFiles &&
                <h3>Total size of file: {sizeOfAllFiles}</h3>
            }
            
            {!!fileClicked &&
            <p>File Clicked: {fileClicked.name}</p>
            }
        </DirectoryTable>
        
    )


}

  