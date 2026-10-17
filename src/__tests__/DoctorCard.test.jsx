import { fireEvent, render, screen } from "@testing-library/react";
import DoctorCard from "../components/DoctorCard";

const doctor = {
  id: 101, name: "Dr. Arun Kumar", specialty: "Cardiologist",
  rating: 4.8, experience: 12, hospital: "City Care Hospital",
  fee: 700, available: true,
};

describe("DoctorCard", () => {
  test("shows doctor details accessibly", () => {
    render(<DoctorCard doctor={doctor} onSelect={() => {}} />);
    expect(screen.getByRole("heading", { name: "Dr. Arun Kumar" })).toBeInTheDocument();
    expect(screen.getByText("Cardiologist")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View profile for Dr. Arun Kumar" })).toBeEnabled();
  });

  test("calls onSelect when the available doctor's profile is selected", () => {
    const onSelect = jest.fn();
    render(<DoctorCard doctor={doctor} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: "View profile for Dr. Arun Kumar" }));
    expect(onSelect).toHaveBeenCalledWith(doctor);
  });

  test("disables profile selection for an unavailable doctor", () => {
    render(<DoctorCard doctor={{ ...doctor, available: false }} onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "View profile for Dr. Arun Kumar" })).toBeDisabled();
  });
});
