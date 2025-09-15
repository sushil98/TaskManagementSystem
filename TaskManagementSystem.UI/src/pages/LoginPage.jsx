import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Card,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomButton from "../common/components/CustomButton";
import { userLogin } from "../api/services/authService";
import { loginValidation } from "../utils/validation";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: yupResolver(loginValidation),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await userLogin(data);

      if (res.success && res.statusCode === 200 && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/task");
      } else {
        console.error("Login failed:", res.message || "Unknown error");
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "98vh",
        width: "100%",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card variant="outlined" sx={{ p: 4, width: 380, borderRadius: 3 }}>
        <Typography>Task Management System</Typography>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            width: "100%",
            fontSize: "clamp(2rem, 6vw, 2.15rem)",
            mb: 2,
            fontWeight: 600,
          }}
        >
          Sign in
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="username"
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="password"
                  type="password"
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </FormControl>

          <CustomButton type="submit" disabled={!isDirty || !isValid}>
            Sign in
          </CustomButton>

          <Typography sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              sx={{ color: "primary.main", fontWeight: 500 }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Login;
