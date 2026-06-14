import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BulkOrderLimitDialog({ open, onClose }: Props) {
  const router = useRouter();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          pb: 1.5,
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 19,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "var(--primary-teal-dark)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Inventory2OutlinedIcon
              sx={{
                color: "#fff",
                fontSize: 24,
              }}
            />
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Need a Larger Quantity?
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Typography
          sx={{
            lineHeight: 1.8,
            fontSize: 14,
          }}
        >
          For larger quantities, please place a Bulk Order. Our team will assist
          you with delivery scheduling, special requirements, and bulk quantity
          requests.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            borderColor: "#e2e8e6",
            color: "text.primary",
            "&:hover": { borderColor: "#ccc" },
          }}
        >
          Continue Retail Order
        </Button>

        <Button
          variant="contained"
          onClick={() => router.push("/bulkorder")}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "var(--primary-teal-dark)",

            "&:hover": {
              bgcolor: "var(--primary-teal-mid)",
            },
          }}
        >
          Go to Bulk Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}
