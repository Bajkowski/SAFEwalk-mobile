import React from "react";
import { create, shallow } from "react-test-renderer";
import renderer from "react-test-renderer";
import { View, Button } from "react-native";
import {
  fireEvent,
  NativeTestEvent,
  act,
  wait,
  waitForElementToBeRemoved,
  render,
} from "@testing-library/react-native";

import UserLoginScreen from "../UserLoginScreen";
import { AuthProvider } from "./../../../../contexts/AuthProvider";

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }) => <>{children}</>,
}));

jest.mock("@react-navigation/stack", () => {
  return { SignupStack: () => jest.fn() };
});

export const createTestProps = (props) => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  },
  ...props,
});

let props;
let component;
let screen;

describe("UserLoginScreen ", () => {
  beforeEach(() => {
    props = createTestProps();

    component = (
      <AuthProvider>
        <UserLoginScreen navigation={props.navigation} />
      </AuthProvider>
    );

    screen = render(component);
  });

  // it("renders correctly", () => {
  //   const tree = renderer.create(component).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  it("displays the logo", () => {
    expect(screen.getByLabelText("logo")).toBeTruthy();
  });

  it("has the correct title", () => {
    expect(screen.getByText("User Login")).toBeTruthy();
  });

  it("has a email TextInput", () => {
    expect(screen.getByLabelText("Email")).toBeTruthy();
  });

  it("has a password TextInput", () => {
    expect(screen.getByLabelText("Password")).toBeTruthy();
  });

  it("has a link to Sign Up screen", () => {
    expect(screen.getByLabelText("signup")).toBeTruthy();
  });

  it('has a "Login" button', () => {
    expect(screen.getByLabelText("Login")).toBeTruthy();
  });

  it('has a "Login as SAFEwalker" button', () => {
    expect(screen.getByLabelText("Login as SAFEwalker")).toBeTruthy();
  });

  it("shows error if input is empty", async () => {
    let loginButton = screen.getByLabelText("Login");
    act(() => {
      fireEvent.press(loginButton);
    });

    // wait for appearance
    await wait(() => {
      expect(screen.getByLabelText("emailRequired")).toBeTruthy();
      expect(screen.getByLabelText("passwordRequired")).toBeTruthy();
    });
  });

  it("shows error if email is not wisc.edu", () => {
    act(() => {
      fireEvent.changeText(screen.getByLabelText("Email"), "test@gmail.com");
    });

    act(() => {
      fireEvent.changeText(screen.getByLabelText("Password"), "asdf");
    });
  });

  it("navigates to Signup screens upon pressing the sign up button", () => {
    let signupButton = screen.getByLabelText("signup");
    expect(signupButton).toBeTruthy();

    act(() => {
      fireEvent.press(signupButton);
    });

    // expect(props.navigation.replace)
    //   .toHaveBeenCalledWith("SignupStack")
  });

  it("shows error if Wisc email is not registered", () => {
    act(() => {
      fireEvent.changeText(screen.getByLabelText("Email"), "test@wisc.com");
    });

    act(() => {
      fireEvent.changeText(screen.getByLabelText("Password"), "asdf");
    });

    let loginButton = screen.getByLabelText("Login");
    act(() => {
      fireEvent.press(loginButton);
    });
  });

  it("navigates to LoggedInScreen if Wisc email is valid and registered", () => {
    act(() => {
      fireEvent.changeText(screen.getByLabelText("Email"), "l@wisc.com");
    });

    act(() => {
      fireEvent.changeText(screen.getByLabelText("Password"), "l");
    });

    let loginButton = screen.getByLabelText("Login");
    act(() => {
      fireEvent.press(loginButton);
    });
  });

  it('navigate to SAFEwalker login screen when user press the "Login as SAFEwalker" button', () => {
    let safewalkerButton = screen.getByLabelText("Login as SAFEwalker");
    act(() => {
      fireEvent.press(safewalkerButton);
    });
  });

  // it("renders correctly", () => {
  //   const tree = renderer.create(component).toJSON();
  //   expect(tree).toMatchSnapshot();
  // });
});