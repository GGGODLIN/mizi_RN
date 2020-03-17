import {useEffect, useState} from 'react';

// The hook is just a simple function which we can export
export const FetchApi = () => {
  const [data, setdata] = useState({});

  async function fetchData() {
    const res = await fetch(
      'http://ttcapi.1966.org.tw/api/DriverInfo/Get/15',
    );
    res
      .json()
      .then(res => {
        console.log(res.msg);
        setdata(res);
      })
      .catch(err => {
        console.log('HAHA ERROR!');
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {data};
};

componentDidMount = async () => {
  const data = await fetch('https://demojson.herokuapp.com/cart').then(
    response => response.json(),
  );
  this.setState({
    album: data,
  });
};