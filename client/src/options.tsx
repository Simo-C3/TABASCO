import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Bookmark } from './helper/storage';

const getQueryParam = (url: string, param: string): string | null => {
  const params = new URLSearchParams(new URL(url).search);
  return params.get(param);
};

interface Share {
  title: string;
  pages: {
    title: string;
    url: string;
  }[];
}

const apiShareRequest = async (id: string): Promise<Share> => {
  const result = await fetch(
    `https://tabasco-server.kurichi.workers.dev/api/v1/share/${id}`,
  );
  return await result.json();
};

const Options = () => {
  const [result, setResult] = useState<Share>();
  const bookmark = new Bookmark();

  useEffect(() => {
    const url = window.location.href;
    const id = getQueryParam(url, 'id');
    if (id) {
      apiShareRequest(id).then(async (result) => {
        setResult(result);
        const groupId = await bookmark.create({
          title: result.title,
        });
        for (const page of result.pages) {
          await bookmark.create({
            title: page.title,
            url: page.url,
            parentId: groupId,
          });
        }
      });
    }
  }, []);

  return (
    <div>
      <div>{result?.title}</div>
      <div>
        {result?.pages.map((value, index) => (
          <div key={index}>
            <p>{value.title}</p>
            <p>{value.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<Options />, document.getElementById('root'));
