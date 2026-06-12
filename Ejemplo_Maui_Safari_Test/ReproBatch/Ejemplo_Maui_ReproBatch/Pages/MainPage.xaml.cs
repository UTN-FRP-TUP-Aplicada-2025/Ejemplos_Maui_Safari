namespace Ejemplo_Maui_ReproBatch.Pages;

public partial class MainPage : ContentPage
{
    public MainPage()
    {
        InitializeComponent();

        webView.Source = "https://aplicada.somee.com/";
    }

    private void WebView_Navigating(object sender, WebNavigatingEventArgs e)
    {
    }

    private void WebView_Navigated(object sender, WebNavigatedEventArgs e)
    {
    }
}