import { useForm, SubmitHandler } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { forwardRef } from "react";
import { Assignee, AssigneeGenderEnum } from "../models/Assignee";
import { useTranslation } from "react-i18next";
import { emailRegex } from "../../../utils";

interface Props {
  onSubmit: (data: Partial<Assignee>) => void;
  errorMessage?: string;
  defaultValue?: Assignee | null;
}

const AssigneeForm = forwardRef(
  ({ onSubmit, errorMessage, defaultValue }: Props, ref) => {
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery("(max-width:1400px)");

    const {
      register,
      handleSubmit,
      reset,
      // setValue,
      formState: { errors },
    } = useForm<Partial<Assignee>>({
      defaultValues: { ...defaultValue, gender: AssigneeGenderEnum.MAN } || {},
    });

    /**
     * State to manage the input gender
     */
    const [gender, setGender] = React.useState("");

    /**
     * Handler for the gender input
     * @param event
     */
    const handleChange = (event: SelectChangeEvent) => {
      setGender(event.target.value);
      console.log("Value: ", event.target.value);
    };

    // console.log(defaultValue);

    React.useEffect(() => {
      defaultValue?.gender && setGender(defaultValue.gender);
    }, [defaultValue?.gender]);

    /**
     * Submit button ref
     * to handle the submission of the form from the parent
     * with useImperativeHandler hook
     */
    const submitBtnRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => ({
      /**
       * Trigger the form submittion form the parent
       */
      triggerSubmit: () => {
        submitBtnRef.current?.click();
      },

      /**
       * Reset the form from the parent
       */
      resetForm: () => {
        reset();
      },
    }));

    const handleFormSubmit: SubmitHandler<Partial<Assignee>> = (data) => {
      onSubmit(data);
      // reset();
    };

    return (
      <div>
        {errorMessage && (
          <Box marginBottom={2}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Assignee name field */}
          <Box marginBottom={2}>
            <TextField
              fullWidth
              size={isSmallScreen ? "small" : "medium"}
              variant="outlined"
              label={t("assignees.assigneeForm.nameField.label")}
              type="text"
              {...register("name", {
                required: {
                  value: true,
                  message: t(
                    "assignees.assigneeForm.nameField.validation.required"
                  ),
                },
                minLength: {
                  value: 3,
                  message: t(
                    "assignees.assigneeForm.nameField.validation.min3characters"
                  ),
                },
              })}
              error={Boolean(errors.name)}
              helperText={errors.name ? errors.name.message : ""}
            />
          </Box>

          {/* Assignee email field */}

          <Box marginBottom={2}>
            <TextField
              fullWidth
              size={isSmallScreen ? "small" : "medium"}
              type="email"
              variant="outlined"
              label={t("assignees.assigneeForm.emailField.label")}
              {...register("email", {
                required: {
                  value: true,
                  message: t(
                    "assignees.assigneeForm.emailField.validation.required"
                  ),
                },
                pattern: {
                  value: emailRegex,
                  message: t(
                    "assignees.assigneeForm.emailField.validation.invalid"
                  ),
                },
              })}
              error={Boolean(errors.email)}
              helperText={errors.email ? errors.email.message : ""}
            />
          </Box>

          {/* Assignee phone field */}

          <Box marginBottom={2}>
            <TextField
              fullWidth
              size={isSmallScreen ? "small" : "medium"}
              variant="outlined"
              label={t("assignees.assigneeForm.phoneField.label")}
              {...register("phone", {
                required: {
                  value: true,
                  message: t(
                    "assignees.assigneeForm.phoneField.validation.required"
                  ),
                },
              })}
              error={Boolean(errors.phone)}
              helperText={errors.phone ? errors.phone.message : ""}
            />
          </Box>

          {/* Assignee gender field */}

          <FormControl fullWidth error={Boolean(errors.gender)}>
            <InputLabel
              id="gender-select-label"
              // @ts-ignore
              size={isSmallScreen ? "small" : "medium"}>
              {t("assignees.assigneeForm.genderField.label")}
            </InputLabel>
            <Select
              size={isSmallScreen ? "small" : "medium"}
              labelId="gender-select-label"
              id="gender-select"
              {...register("gender", {
                required: {
                  value: true,
                  message: "Le genre est requis.",
                },
              })}
              label="Gender"
              value={gender || ""}
              onChange={handleChange}>
              <MenuItem value={AssigneeGenderEnum.MAN}>{t("men")}</MenuItem>
              <MenuItem value={AssigneeGenderEnum.WOMEN}>{t("women")}</MenuItem>
            </Select>
            {errors.gender && (
              <FormHelperText>{errors.gender.message}</FormHelperText>
            )}
          </FormControl>

          {/* <Box>
            <FormControl fullWidth error={Boolean(errors.gender)}>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                label="Gender"
                {...register("gender", {
                  required: {
                    value: true,
                    message: "Le genre est requis.",
                  },
                })}
                error={Boolean(errors.gender)}>
                <MenuItem value="0">Man</MenuItem>
                <MenuItem value="1">Woman</MenuItem>
              </Select>

              {errors.gender && (
                <FormHelperText>{errors.gender.message}</FormHelperText>
              )}
            </FormControl>
          </Box> */}

          <Button
            ref={submitBtnRef}
            style={{ display: "none" }}
            type="submit"
            variant="contained"
            color="primary">
            Submit
          </Button>
        </form>
      </div>
    );
  }
);

export default AssigneeForm;
