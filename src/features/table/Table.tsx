import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table'
import {Iarticle} from './tableSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  getNews,
  selectNews,
} from './tableSlice';
import Button from '@material-ui/core/Button'

export interface InewsState {
  newsArray: Iarticle[];
}


export function Table() {
  const news = useAppSelector(selectNews);
  const dispatch = useAppDispatch();

  
  const [newsState, setNews] = useState<InewsState>({
    newsArray: []
  });


  useEffect(() =>{
    dispatch(getNews())
  },[])

  useEffect(() => {
    let cleanArticles: Iarticle[] = []

    news.forEach((item:Iarticle) => { 
      let cleanArticle: Iarticle = {
        source: item.source,
        author: item.author,
        title: item.title,
        description: item.description,
        url: item.url,
        urlToImage: item.urlToImage,
        publishedAt: item.publishedAt,
        content:item.content
      }
      cleanArticles.push(cleanArticle)

    })
    setNews({
      ...newsState,
      newsArray: cleanArticles
    })
    console.log('estado despues del setstate' +newsState.newsArray)
  },[news])



  const headers=[
    {
      title:'Image',
      field:'image',
      render: (item:any) => <img src={item.urlToImage} style={{width:100}}/>
    },
    {
      title:'Source',
      field:'source',
    },
    {
      title:'Author',
      field:'author',
    },
    {
      title:'Title',
      field:'title',
    },
    {
      title:'Date',
      field:'publishedAt',
      render: (item:any) => <time dateTime={item.publishedAt}>{item.publishedAt.toDateString()}</time>
    },
    {
      title:'URL',
      field:'url',
      render: (item:any) => 
      <Button variant="contained" href={item.url}>
      Link
      </Button>
      
    }
  ]
  

  return (
    <div className='table'>
      {
        newsState.newsArray.length ? <MaterialTable
        columns={headers}
        data={newsState.newsArray}
        title="News!"
        options={
          {pageSize:10}
        }
      />: <div></div>
      }
    </div>
  );
}
