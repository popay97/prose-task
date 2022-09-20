//API RESPONSES
interface LoginResponse {
    access_token: string;
    token_type: string;
    is_first_login: boolean,
}
interface topResponse {
    result: {
    category: string;
    sentences: string[]
    }[]
}
interface tokenizeResponse{
    sentences: string[]
}
interface individualResponse
    {
        analysed_sentences: [
          {
            sentence: "string",
            result: [
              {
                category: string,
                attribute: string,
                value: string
              }
            ]
          }
        ],
        analysed_results: [
          {
            category: string,
            attribute: string,
            value: string
          }
        ]
      }
//REDUX
interface Action{
    type: string;
    payload: topResponse;
}

// export all interfaces from file
export type { LoginResponse, topResponse, tokenizeResponse,Action, individualResponse};