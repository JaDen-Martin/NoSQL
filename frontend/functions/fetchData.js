export async function fetchData(url) {
  

  const res = await fetch(url);

  if (!res.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  } 
  const data = await res.json();

  return data;
  
    }

