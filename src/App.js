import React, { useState, useEffect } from 'react';
import './styles.css';

import { getToken, getAccountData } from './api';
import {client_id, input_provider, test } from './config';

function getFavoriteMerchantByResults(results) {
  const merchantsMap = new Map();
  results.forEach(result => {
    const { originalDescription, originalAmount } = result.transaction;
    // couldn't use merchantId, I suppose is because it's test data 
    const merchant = originalDescription;
    if (merchantsMap.has(merchant)) { 
      const current = merchantsMap.get(merchant); 
      merchantsMap.set(merchant, originalAmount + current); 
    } else { 
      merchantsMap.set(merchant, originalAmount); 
    } 
  });

  let favorite = {value: 0}; 
  for (let [key, value] of merchantsMap.entries()) { 
    if (value < favorite.value) { favorite = { key, value } } 
  }

  return favorite;
}

const LogIn = () => {
  const onClick = (ev) => {
    ev.stopPropagation();
    window.location.href = `https://link.tink.com/1.0/authorize/?client_id=${client_id}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=accounts:read,investments:read,transactions:read,user:read,statistics:read,identity:read,credentials:read&market=SE&input_provider=${input_provider}&locale=en_US&test=${test}`;
  }

  return (
    <div className='container'>
      <div className='btn' onClick={onClick}>Click here to connect with Tink Link</div>
    </div>
  );
}

const FavoriteMerchantReport = ({ data }) => {
  const { results } = data;
  const favorite = getFavoriteMerchantByResults(results);
  const spentValue = favorite.value * -1;
  return (
    <div className='report'>
      <div className='color-grey'>Your favorite merchant:</div>
      <h2 className='report-value'>{spentValue} kr</h2>
      <div className=''>During 2020 you've spent {spentValue} kr in <strong>{favorite.key}</strong></div>
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState();
  const [data, setData] = useState();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  useEffect(() => {
    if (!code || !code.length) {
      return;
    }

    if (!token) {
      getToken(code).then(access_token => {
        setToken(access_token);
      });
    } else {
      getAccountData(token).then(accountData => {
        setData(accountData);
      });
    }
  }, [code, token]);

  return (
    <div className='app'>
      { data ? <FavoriteMerchantReport data={data} /> : <LogIn /> }
    </div>
  );
}
