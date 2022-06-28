import firebase from "firebase/app";
import "firebase/auth";

export const getProblem = async (
    id,
) => {
  const works = await fetch(`/api/getProblem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        id,
    }),
  });
  if (works.status !== 200 && works.status !== 201) {
    return await works.text();
  }
  
  return await works.json();
};