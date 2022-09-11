import { NextApiRequest, NextApiResponse } from "next";

export default (request: NextApiRequest, response: NextApiResponse) => {
  console.log(request.query)

  const users = [
    { id: 1, name: 'Wallace' },
    { id: 2, name: 'Diego' },
    { id: 3, name: 'Mike' }
  ]

  return response.json(users);
}