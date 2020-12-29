
import React, { Props, useState } from "react";
import styled from "styled-components";
import { ListEntriesResult,ListEntriesQuery } from "../generated-api";
// import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { NEXT_PAGE, PREV_PAGE} from "../utils/constants";

interface TableProps{
    data?:ListEntriesQuery,
    currDirectory?:string,
    goUpDirectory: (path:string)=>void,
    goBackDirectory: ()=>void,
    currPage:number,
    changePage:(direction:string)=>void,
    fileClicked:any,
    setFileClicked:(file:any)=>void,
}

interface DirectoryProps{
    backgroundColor:string
}

export const Table:React.FC<TableProps>=({data,
    currDirectory,
    goUpDirectory,
    goBackDirectory,
    changePage,
    currPage,
    fileClicked,
    setFileClicked,
})=>{

//Keeping the sort state on table, because it's unrelated to anything to it's parent
    const [sortType, setSortType] = useState<string>();     
    const DirectoryTable = styled.div`
        border: 1px solid gray;
        width: 40%;
        
        max-height:600px;
        overflow:auto;
    `;

    const DirectoryHeader = styled.div`
        height:45px;
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        background-color:rgb(200,100,50);
        padding:10px;
    `


    const DirectoryFooter = styled.div`
        
        padding:10px;
        background-color:rgb(200,100,50);
        overflow:hidden;
        p{
            margin:0;
        }

    `
    const Directory = styled.div<DirectoryProps>`
        width:100%;
        border:1px solid black;
        padding:10px;
        box-sizing:border-box;
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        background-color:${(props=>props.backgroundColor)}
    `

    const Select = styled.div`
        display:flex;
        flex-direction:column;
        height:100%;
        padding:0;
        margin:0;
        justify-content:flex-start;
        p{
            cursor:pointer;
            margin-top:-10px;
        }

    `
    const listEntries = data?.listEntries;
    const entries = listEntries?.entries || [];
    const totalPages = listEntries?.pagination.pageCount;


    let sortedEntries;
    

    /*Sets up the sorting that the user can pick from. Arrays are sliced because of mutability, definitely other 
    solutions that would be better,but for this I think it should be fine */


    switch(sortType){
        case("name"):
            sortedEntries = entries.slice().sort((a:any,b:any)=>{
                if(a.name.localeCompare(b.name)==1){
                    return 1;
                }
                return -1;
            })
            break;
        case("filetype"):
            sortedEntries = entries.slice().sort((a:any,b:any)=>{
                if(a['__typename'].localeCompare(b['__typename'])==1){
                    return 1;
                }
                return -1;
            })
            break;
        default:
            sortedEntries = entries;            
    }
   

    return(
        <DirectoryTable>
            <DirectoryHeader>
                    <p> Current Directory: {currDirectory}</p>
                    <Select>
                        
                       <p  onClick={()=>setSortType('name')}>Sort by: Name </p>
                       <p  onClick={()=>setSortType('filetype')}>Sort by: Filetype </p>
                        
                    </Select>
                   
                    <p onClick={goBackDirectory}>Go Back</p>
                
            </DirectoryHeader>
            {sortedEntries.map((entrie:any)=>{
                
                return(
                    <Directory backgroundColor={entrie?.name == fileClicked?.name ? "grey":"white"} key={entrie.name} onClick={()=>{
                        if(entrie["__typename"] === "File"){
                            setFileClicked(entrie);
                        }else{
                            goUpDirectory(entrie.path)}
                        }
                    }>
                    
                    <span>{entrie.name}</span>
                    {!!entrie.size && 
                    <span>{entrie.size}</span>
                    
                    }
                    {!!entrie.lastModified && 
                    <span>{entrie.lastModified}</span>
                    
                    }
                    </Directory>
                )
            })}
            <DirectoryFooter>
                <p>You are currently on page: {currPage} of {totalPages}</p>
                <p onClick={()=>changePage(NEXT_PAGE)}>Go to next</p>
                <p onClick={()=>changePage(PREV_PAGE)}>Go back a page</p>
            </DirectoryFooter>
        </DirectoryTable>
    )


}



  