const express = require('express')
const usetube = require('usetube')
const bodyParser = require('body-parser')
const path = require('path')
const multer = require('multer')
const { equal } = require('assert')
const { Parser } = require('json2csv');
const fs = require('fs');
const ytdl = require('ytdl-core')
const cors= require('cors')
const { text } = require('body-parser')
// import userController from './controllers/userController';


const app = express();



app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname+'/views'))
app.set('view engine', 'hbs')

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/public/home.html')

    // let data = await getChannel('carryminati')
    // console.log(data)

})

// app.get('/download', userController.download);

app.post('/', async function (req, res) {

    let query = req.body.search;
    let option = req.body.drop;

    if (option == "Search Video") {

        console.log('Search Video')
        let data = await getVideo(query);

    //    res.send(data)
        // const json2csvParser = new Parser();
        // const csv = json2csvParser.parse(data);

        

        // const downloadResource = (res, fileName, fields, data) => {
        //   const json2csv = new Parser({ fields });
        //   const csv = json2csv.parse(data);
        //   res.header('Content-Type', 'text/csv');
        //   res.attachment(fileName);
        //   return res.send(csv);
        // }

        // downloadResource(res,fileName,fields,data);
        
            res.render('videos', {
               video: data.videos,
            //    message: 'Greetings from geekforgeeks'
            })

            

        
    }

    else if (option == "Search Channel") {
        let data = await getChannel(query);
        console.log('Search Channel')
        if(data=='') res.send('Data Not Found')
        // res.send(data)
        res.render('channels', {
            video: data.channels,
         //    message: 'Greetings from geekforgeeks'
         })

        // res.send(data);
    }

    else if( option =="Download Video")
    {
        // Download the Video
        // res.json({url:query});
        // let query = getVideoId(query);
        let is_utube = parseVideoUrl(query); 
        console.log(is_utube)
        // if(is_utube==false)
        // {
        //     // res.redirect('/')
        //     res.send('Input Data Unsupported. Kindly Enter Correct Link in the Field');
            

        // }
        // else
        // {
            res.header('Content-Disposition','attachment ; filename="download.mp4')

            ytdl
            ( query,{
                format: 'mp4'
            }).pipe(res);
    
        // }
        
        // res.redirect(__dirname+'../public/thankyou.html')

    }

    else if( option =="Video Desc")
    {
        let id = getVideoId(query);
        console.log(query)
        console.log(id)
        let data = await videoDesc(id);
        res.send(data);
    }

    else if( option =="Channel Desc")
    {
        let id= getChannelId(query);
        console.log(query)
        console.log(id)
        let data = await channelDesc(id);
        res.send(data);
    }



})


app.get('/auto',function(req,res)
{
    res.send('hu')
})




app.listen(5000, function (req, res) {
    console.log(`Server has started on port https://localhost:5000/`);
})



async function getChannel(query) {
    let data = await usetube.searchChannel(query)
    return data;
}

async function getVideo(query) {
    let data = await usetube.searchVideo(query)
    return data;
}

async function searchChannel(query) {
    let data = await usetube.searchChannel(query)
    return data;
}

async function videoDesc(query)
{
    let data= await usetube.getVideoDesc(query);
    return data;
}

async function channelDesc(query)
{
    let data= await usetube.getChannelDesc(query);
    return data;
}

function getChannelId(query)
{
    // let id = query;
    //     var a="";

    //     let i=0;
    //     while(id[i]!='?')
    //     {
    //         i++;
    //     }

    //     for(let j=i+1;j<id.length;j++)
    //     {
    //         a+=id[j];
    //     }

    //  let a = slice(, end)
    let a="";
     for(let i=32;i<query.length;i++)
     {
        a+=query[i];
     }
        return a;
}

function getVideoId(query)
{
    let id = query;
        var a="";

        let i=0;
        while(id[i]!='?')
        {
            i++;
        }

        for(let j=i+3;j<id.length;j++)
        {
            a+=id[j];
        }

        return a;
}

function download_data(query)
{
      
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(query);

    fs.writeFileSync('text.csv', csv, (err) => {
        if (err) throw err;
        console.log('The lyrics were updated!');
    });

    res.download(__dirname+'/text.csv')
}

function parseVideoUrl(url) {
    const regExp ='^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$';
    const match = url.match(regExp);
    return match;
  }

  