import { Response } from "./types";

/**
 * Credits to cosmicgenius on GitHub: Fetches from the server using a POST request.
 * @param Output expected output on success
 * @param route route to fetch from
 * @param body body of the POST request
 * @returns A promise returning a Result of type Output or string.
 * It is guaranteed that result.value is of type Output when result.success is true,
 * and result.value is of type string when result.success is false.
 */

export async function post<Output>(
  url: string,
  data: object,
): Promise<Response<Output>> {

  const attempt = await fetch(`api/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const value: string = await attempt.text();
  let output: Output;
  let result: Response<Output> = { success: false, value };

  const success = attempt.status >= 200 && attempt.status < 300;

  try {
    output = JSON.parse(value);

    if (success) {
      result = { success: true, value: output };
    }
  } catch (_) {
    /*
     Assume that the serverside response is in the correct format i.e. 
     if it returns success, and we cannot parse it to JSON it must be 
     a string. Similarly, we must also assume that the clientside 
     function call is valid, i.e. that the given Output type is a 
     subtype of string
     there doesn't seem to be a good way to implement a check for this
    */
    if (success) {
      result = { success: true, value: value as unknown as Output };
    }
  } finally {
    return result;
  }
}