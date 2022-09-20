import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { topResponse, tokenizeResponse, individualResponse } from "../knownInterfaces";
import { actionsCreators } from '../state';
import axios from 'axios';
import { store } from '../state/store/index';
import { bindActionCreators } from 'redux';
import { useAppDispatch } from '../state/hooks';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import './Dashboard.css';


export default function Dashboard() {
  let substitute: individualResponse[] = [];
  const [selectedFile, setSelectedFile] = React.useState<File>();
  const [sentences, setSentences] = React.useState<tokenizeResponse>();
  const [topResult, setTopResult] = React.useState<topResponse>();
  const [individualResults, setIndividualResults] = React.useState(substitute);
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [spinner, setSpinner] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const formData = new FormData();
  useEffect(() => {
    if (token == null || token == undefined || token == "") {
      window.location.href = "/login";
    }
  }, [token]);
  useEffect(() => {
    function topModel() {
      axios.post("https://tasks.prose.biz/api/v1/ai/top/", { sentences: sentences?.sentences }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      }).then((res) => {
        let x: topResponse = res.data;
        //dispatch to redux store
        store.dispatch(actionsCreators.loadSentences(x));
        setTopResult({ result: [...x.result] });
      }).catch((err) => {
        console.log(err);
      })
    }
    if (sentences?.sentences) {
      topModel();
    }
  }, [sentences]);
  useEffect(() => {
    if(individualResults.length === topResult?.result.length){
      setLoading(false);
    }
   }, [individualResults]);     

  useEffect(() => {
    var responses: individualResponse[] = [];
    async function individualResults() {
      let len = topResult?.result.length;
      if (len === undefined) {
        return 0;
      }
      else {
        for (let i = 0; i < len; i++) {
          await axios.post("https://tasks.prose.biz/api/v1/ai/individual/", topResult?.result[i], {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }).then(res => {
            let rezultat: individualResponse = res.data;
            responses.push(rezultat);
            
          }).catch(err => {
            console.log(err);
          })
        }
        setIndividualResults([...responses]);
      }

    }
    individualResults();
  }, [topResult]);

  async function handleFileUpload(e: any) {
    e.preventDefault();
    setSpinner(true);
    if (selectedFile != undefined) {
      formData.append("file", selectedFile);
      try {
        await axios.post("https://tasks.prose.biz/api/v1/ai/tokenize/file/", formData, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }).then((res) => {
          let sentences = res.data.sentences.map((sentence: string) => sentence);
          setSentences({ sentences: [...sentences] });
        });
      } catch (e) {
        console.log(e);
        setSpinner(false);
      }
    }
  }
  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    }}>
      <div className="upload">
        <Form onSubmit={handleFileUpload}>
          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Give me a pdf file</Form.Label>
            <Form.Control type="file" onChange={async (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files) {
                let file = target.files[0];
                setSelectedFile(file);
              }
            }} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <div className='results'>
        <div className="top">
          <h2>TOP AI results</h2>
          <ListGroup as="ol" >
            {!loading ? topResult?.result.map((res, index) => {
              return (<><ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  {res.sentences.map((sentence, index) => {
                    return (
                    <span>{sentence}</span>
                    )
                  })
                  }
                </div>
                <Badge bg="primary" pill>
                  {res.category}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="listitem">
                <span>{"Attributes: "+ individualResults[index].analysed_results.map((res,index)=>{return( res.attribute)})}</span>
                <span>{"Values: "+ individualResults[index].analysed_results.map((res,index)=>{return(res.value)} )}</span>
                </div>
              </ListGroup.Item>
              </>)
            }) : spinner === true ? <Spinner animation="grow" variant="info" />: <></>}

          </ListGroup>
        </div>
      </div>
    </div>
  );
}
