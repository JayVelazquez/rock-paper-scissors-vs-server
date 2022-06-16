const fs = require('fs');

const http = require('http');

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  switch(url.pathname) {
    case '/':
    if (request.method === 'GET'){
     const name = url.searchParams.get('name'); 
      console.log(`User ${name} has started playing`);
      response.writeHead(200, {'Content-Type': 'text/html'}
      );
      fs.createReadStream('index.html').pipe(response);
      break;
    }
    else if (request.method === 'POST') {
      handlePostResponse(request, response) 
      break;
    }
    default: 
    response.writeHead(404, {'Content-Type': 'text/html'});
      fs.createReadStream('404.html').pipe(response)
      break;
  }
})

server.listen(3000, () => {
  console.log(`Server is listening on http://localhost:${server.address().port}`)
});

function handlePostResponse(request, response){
  request.setEncoding('utf8');
  
  let body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });
  
  request.on('end', function () {
    const choices = ['rock', 'paper', 'scissors'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Ahhh, its a tied! I also chose ${randomChoice}.`;
    const victory = `Darn, you won! I chose ${randomChoice}.`;
    const defeat = `Haha! You loose. I chose ${randomChoice}.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
        (choice === 'rock' && randomChoice === 'paper') ||
        (choice === 'paper' && randomChoice === 'scissors') ||
        (choice === 'scissors' && randomChoice === 'rock')) {
      message = defeat;
    } else {
      message = victory;
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`You selected ${choice}. ${message}`);
  });
}