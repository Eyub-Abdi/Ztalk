import { useState } from "react";
import clsx from "clsx";
import {
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCreditCard,
  FiX,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
import { FaPaypal, FaCcStripe } from "react-icons/fa";
import { Spinner } from "../../components/Spinner";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    type: "earning",
    description: "Lesson with Mark Rose",
    amount: 45.0,
    date: new Date("2025-12-17T14:30:00"),
    status: "completed",
  },
  {
    id: "2",
    type: "earning",
    description: "Lesson with Cindy Tolbert",
    amount: 60.0,
    date: new Date("2025-12-16T10:00:00"),
    status: "completed",
  },
  {
    id: "3",
    type: "withdrawal",
    description: "Withdrawal to PayPal",
    amount: -150.0,
    date: new Date("2025-12-15T09:00:00"),
    status: "completed",
  },
  {
    id: "4",
    type: "earning",
    description: "Lesson with Íñigo",
    amount: 30.0,
    date: new Date("2025-12-14T16:00:00"),
    status: "completed",
  },
  {
    id: "5",
    type: "earning",
    description: "Lesson with Sarah Johnson",
    amount: 45.0,
    date: new Date("2025-12-13T11:00:00"),
    status: "pending",
  },
  {
    id: "6",
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: -200.0,
    date: new Date("2025-12-10T08:00:00"),
    status: "completed",
  },
];

// Stats data
const mockStats = {
  availableBalance: 280.0,
  pendingBalance: 45.0,
  totalEarnings: 1250.0,
  thisMonthEarnings: 325.0,
  totalWithdrawn: 970.0,
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subtitle,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "brand" | "green" | "orange" | "purple";
  subtitle?: string;
}) {
  const colorClasses = {
    brand: "from-brand-500 to-indigo-600 shadow-brand-500/20",
    green: "from-green-500 to-emerald-600 shadow-green-500/20",
    orange: "from-orange-500 to-amber-600 shadow-orange-500/20",
    purple: "from-purple-500 to-pink-600 shadow-purple-500/20",
  };

  const bgColorClasses = {
    brand: "bg-brand-50 text-brand-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {label}
          </span>
          <span className="text-2xl md:text-3xl font-bold text-gray-900">
            {value}
          </span>
          {subtitle && (
            <span className="text-xs text-gray-500 font-medium">
              {subtitle}
            </span>
          )}
        </div>
        <div className={clsx("p-3 rounded-xl", bgColorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div
        className={clsx(
          "absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity",
          colorClasses[color]
        )}
      />
    </div>
  );
}

function TransactionItem({
  transaction,
}: {
  transaction: (typeof mockTransactions)[0];
}) {
  const isEarning = transaction.type === "earning";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            isEarning
              ? "bg-green-100 text-green-600"
              : "bg-orange-100 text-orange-600"
          )}
        >
          {isEarning ? (
            <FiArrowDownLeft className="w-5 h-5" />
          ) : (
            <FiArrowUpRight className="w-5 h-5" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">
            {transaction.description}
          </p>
          <p className="text-sm text-gray-500">
            {transaction.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={clsx(
            "font-bold",
            isEarning ? "text-green-600" : "text-gray-900"
          )}
        >
          {isEarning ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
        </span>
        {transaction.status === "pending" ? (
          <span className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-lg">
            <FiClock className="w-3 h-3" />
            Pending
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
            <FiCheckCircle className="w-3 h-3" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
}

// Withdrawal Modal
function WithdrawalModal({
  isOpen,
  onClose,
  availableBalance,
}: {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"paypal" | "bank" | "stripe">("paypal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: FaPaypal,
      description: "Instant transfer",
      color: "text-blue-600",
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: FaCcStripe,
      description: "1-2 business days",
      color: "text-purple-600",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: FiCreditCard,
      description: "3-5 business days",
      color: "text-gray-600",
    },
  ];

  const selectedMethod = paymentMethods.find((m) => m.id === method);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (parseFloat(amount) > availableBalance) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    onClose();
    // Show success notification (in a real app)
  };

  const quickAmounts = [50, 100, 200, availableBalance];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-500 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FiArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
                <p className="text-white/80 text-sm">
                  Available: ${availableBalance.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <FiX className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-lg">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
            {parseFloat(amount) > availableBalance && (
              <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                <FiAlertCircle className="w-4 h-4" />
                Exceeds available balance
              </p>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount, idx) => (
              <button
                key={idx}
                onClick={() => setAmount(quickAmount.toString())}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  parseFloat(amount) === quickAmount
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {idx === quickAmounts.length - 1 ? "Max" : `$${quickAmount}`}
              </button>
            ))}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Withdrawal Method
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  {selectedMethod && (
                    <>
                      <selectedMethod.icon
                        className={clsx("w-6 h-6", selectedMethod.color)}
                      />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {selectedMethod.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedMethod.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <FiChevronDown
                  className={clsx(
                    "w-5 h-5 text-gray-400 transition-transform",
                    methodDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {methodDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => {
                        setMethod(pm.id as "paypal" | "bank" | "stripe");
                        setMethodDropdownOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors",
                        method === pm.id && "bg-brand-50"
                      )}
                    >
                      <pm.icon className={clsx("w-6 h-6", pm.color)} />
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-900">{pm.name}</p>
                        <p className="text-xs text-gray-500">
                          {pm.description}
                        </p>
                      </div>
                      {method === pm.id && (
                        <FiCheckCircle className="w-5 h-5 text-brand-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fee Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <FiInfo className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Processing Fee
              </p>
              <p className="text-sm text-amber-700">
                A 2.5% processing fee will be applied to your withdrawal.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">You&apos;ll receive</p>
            <p className="text-lg font-bold text-gray-900">
              ${amount ? (parseFloat(amount) * 0.975).toFixed(2) : "0.00"}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > availableBalance ||
              isSubmitting
            }
            className={clsx(
              "px-8 py-3 rounded-xl font-semibold transition-all",
              !amount ||
                parseFloat(amount) <= 0 ||
                parseFloat(amount) > availableBalance
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-brand-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-brand-500/30"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" color="white" />
                Processing...
              </span>
            ) : (
              "Withdraw"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Wallet
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your earnings and withdrawals
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all"
        >
          <FiArrowUpRight className="w-5 h-5" />
          Withdraw
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Available Balance"
          value={`$${mockStats.availableBalance.toFixed(2)}`}
          icon={FiDollarSign}
          color="green"
          subtitle="Ready to withdraw"
        />
        <StatCard
          label="Pending"
          value={`$${mockStats.pendingBalance.toFixed(2)}`}
          icon={FiClock}
          color="orange"
          subtitle="Processing"
        />
        <StatCard
          label="This Month"
          value={`$${mockStats.thisMonthEarnings.toFixed(2)}`}
          icon={FiTrendingUp}
          color="brand"
          subtitle="December 2025"
        />
        <StatCard
          label="Total Earnings"
          value={`$${mockStats.totalEarnings.toFixed(2)}`}
          icon={FiDollarSign}
          color="purple"
          subtitle="All time"
        />
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">
                Available Balance
              </p>
              <p className="text-4xl md:text-5xl font-bold">
                ${mockStats.availableBalance.toFixed(2)}
              </p>
              <p className="text-white/60 text-sm mt-2">
                +${mockStats.pendingBalance.toFixed(2)} pending
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-600 font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                <FiArrowUpRight className="w-5 h-5" />
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                Total Earned
              </p>
              <p className="text-xl font-bold mt-1">
                ${mockStats.totalEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                Total Withdrawn
              </p>
              <p className="text-xl font-bold mt-1">
                ${mockStats.totalWithdrawn.toFixed(2)}
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                This Month
              </p>
              <p className="text-xl font-bold mt-1">
                ${mockStats.thisMonthEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Transaction History
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Your recent earnings and withdrawals
              </p>
            </div>
            <button className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              View All
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {mockTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        availableBalance={mockStats.availableBalance}
      />
    </div>
  );
}
