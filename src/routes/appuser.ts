import { CMiscellaneous } from "./../controllers/miscellaneous_controller";
import { CPostAppUser, CGetsAppUser } from "../controllers/appuser_controller";
import { CValidateAppUser } from "../services/validate_appuser";
import { CEncrypt } from "../services/miscellaneous";
import express, { Request, Response } from "express";

import { IAppUser } from "../services/interfaces";

const routeAppUser = express.Router();
const cors = require("cors");
const cmiscellaneous = new CMiscellaneous();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

routeAppUser.use(cors({ origin: "*" }));
routeAppUser.use(express.static("assets"));
routeAppUser.use(cors());
routeAppUser.use(cors(corsOptions));

routeAppUser.route("/help").get((req: Request, res: Response) => {
  cmiscellaneous.serverResponse(
    "This is going to reponse a help about AppUser ==> " +
      new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
    res,
    "From AppUser Help"
  );
});

routeAppUser.route("/post").post((req: Request, res: Response) => {
  const requestedData = req.query;
  req.on("data", function (data) {
    const cValidateAppUser = new CValidateAppUser(JSON.parse(data));
    cmiscellaneous.serverResponse(
      cValidateAppUser.getIsValidAppUser(),
      res,
      ""
    );
  });

  // const validation = cValidateAppUser.getIsValidAppUser();

  // console.log(validation);
  // if (validation == "valid") {
  //   const cPostAppUser = new CPostAppUser();
  //   cPostAppUser.postAppUser(requestedData).then(function (result) {
  //     cmiscellaneous.serverResponse(result, res, "");
  //   });
  // } else {
  //   cmiscellaneous.serverResponse({ response: validation }, res, "");
  // }
});

routeAppUser.route("/signin").get((req: Request, res: Response) => {
  const cGetsAppUser = new CGetsAppUser();
  const requestData = req.query;

  cGetsAppUser.getAppUser(requestData).then(function (result) {
    if (result === "Not Record Found") {
      cmiscellaneous.serverResponse("Not Record Found!!", res, "Signing");
    } else {
      const cEncrypt = new CEncrypt();
      const a = JSON.parse(JSON.stringify(result));
      const b = JSON.parse(JSON.stringify(requestData));
      cEncrypt.validatePassword(b.passcode, a.passcode).then(function (result) {
        if (result == "Not Allowed" || result == undefined) {
          cmiscellaneous.serverResponse(result, res, "");
        } else {
          delete a.passcode;
          cmiscellaneous.serverResponse(a, res, "");
        }
      });
    }
  });
});

export { routeAppUser };
